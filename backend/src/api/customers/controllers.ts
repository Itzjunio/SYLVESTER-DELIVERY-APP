import { Request, Response, NextFunction } from "express";
import { RestaurantModel, OrderModel } from "../shared/models";
import { placeOrderSchema, getNearbyRestaurantsSchema, filterSchema, ratingSchema} from "./schemas";
import { Types } from "mongoose";
import { IMenuItem } from "../../types/";
import { serializeResponse } from "../../profile";
import { getSocketServerInstance } from "../../shared/utils/socket";
import { isValidObjectId } from "../../shared/utils/validators";

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerId = req.user?._id;
  if (!customerId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const parsedBody = placeOrderSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const issues = parsedBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { restaurantId, items, paymentMethod, scheduled } = parsedBody.data;

  isValidObjectId(restaurantId);

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    const err = new Error("Restaurant not found.") as any;
    err.statusCode = 404;
    return next(err);
  }

  let calculatedTotalAmount = 0;
  const processedItems: Types.DocumentArray<IMenuItem> =
    new Types.DocumentArray<IMenuItem>([]);

  for (const reqItem of items) {
    const menuItem = restaurant.menu.find((m) => m.name === reqItem.name);
    if (!menuItem || !menuItem.isAvailable) {
      const err = new Error(
        `Item "${reqItem.name}" is not available or does not exist.`
      ) as any;
      err.statusCode = 400;
      return next(err);
    }
    calculatedTotalAmount += menuItem.price * reqItem.quantity;
    processedItems.push({
      name: menuItem.name,
      quantity: reqItem.quantity,
      price: menuItem.price,
    } as any);
  }

  const newOrder = {
    customerId,
    restaurantId: new Types.ObjectId(restaurantId),
    items: processedItems,
    totalAmount: calculatedTotalAmount,
    scheduled,
    paymentMethod,
  };

  // Todo: The payment gateway logic is crucial here.
  // The order should only be created in the DB after a successful payment.
  const createdOrder = await OrderModel.create(newOrder);
  const io = getSocketServerInstance();
  io.to(`user_${customerId}`).emit("orders:new", { order: createdOrder });
  io.to(`restaurant_${restaurantId}`).emit("orders:new", {
    order: createdOrder,
  });

  return res
    .status(201)
    .json(
      serializeResponse(
        "success",
        { order: createdOrder },
        "Order placed successfully."
      )
    );
};

export const getNearbyRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedBody = getNearbyRestaurantsSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const issues = parsedBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { latitude, longitude, maxDistanceInMeters } = parsedBody.data;
  const restaurants = await RestaurantModel.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceInMeters,
      },
    },
  });
  if (!restaurants || restaurants.length === 0) {
    const err = new Error("No restaurants found nearby.") as any;
    err.statusCode = 404;
    return next(err);
  }
  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        { restaurants },
        "Nearby restaurants fetched successfully."
      )
    );
};

export const getRestaurantMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    const err = new Error("Restaurant ID is required.") as any;
    err.statusCode = 400;
    return next(err);
  }

  isValidObjectId(restaurantId);

  const restaurant = await RestaurantModel.findById(restaurantId);
  if (!restaurant) {
    const err = new Error("Restaurant not found.") as any;
    err.statusCode = 404;
    return next(err);
  }
  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        { menu: restaurant.menu },
        "Menu fetched successfully."
      )
    );
};

export const getOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerId = req.user?._id;
  if (!customerId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }
  const orderHistory = await OrderModel.find({ customerId });
  if (!orderHistory || orderHistory.length === 0) {
    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          { orderHistory: [] },
          "No order history found."
        )
      );
  }
  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        { orderHistory },
        "Order history fetched successfully."
      )
    );
};


export const getCustomerScheduledOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user?._id;
    const now = new Date();

    if (!customerId) {
      const err = new Error("Authentication required.") as any;
      err.statusCode = 401;
      return next(err);
    }

    const scheduledOrders = await OrderModel.find({
      customerId,
      orderStatus: "scheduled",
      scheduledFor: { $gte: now },
    }).sort({ scheduledFor: 1 });

    return res.status(200).json({
      status: "success",
      data: scheduledOrders,
    });
  } catch (err) {
    next(err);
  }
};

export const rating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message).join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { orderId, rating, comment } = parsed.data;
  const customerId = (req as any).user?.id;
  try {
    const order = await OrderModel.findOne({ _id: orderId, customerId });
    if (!order) {
      const err = new Error("Order not found or not owned by user") as any;
      err.statusCode = 404;
      return next(err);
    }

    if (order.orderStatus !== "delivered") {
      const err = new Error("You can rate only after the order is delivered") as any;
      err.statusCode = 400;
      return next(err);
    }

    order.rating = rating;
    if (comment !== undefined) order.comment = comment;
    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Rating submitted successfully",
      data: { orderId: order._id, rating: order.rating, comment: order.comment },
    });
  } catch (error) {
    next(error);
  }
};

// fixed: ...
export const filter = async(req: Request, res: Response, next: NextFunction) => {
  const parsedBody = filterSchema.safeParse(req.query);
  if (!parsedBody.success) {
    const issues = parsedBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { cuisine, minRating, maxDeliveryTime } = parsedBody.data;

  try {
    const pipeline: any[] = [
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
    ];

    const match: any = {};
    if (minRating !== undefined) {
      match.rating = { $gte: minRating };
    }
    if (cuisine) {
      match["restaurant.cuisine"] = cuisine;
    }
    pipeline.push({
      $addFields: {
        deliveryTimeMinutes: {
          $cond: [
            { $and: ["$pickedUpAt", "$deliveredAt"] },
            { $divide: [{ $subtract: ["$deliveredAt", "$pickedUpAt"] }, 1000 * 60] },
            null,
          ],
        },
      },
    });

    if (maxDeliveryTime !== undefined) {
      match.deliveryTimeMinutes = { $lte: maxDeliveryTime };
    }

    if (Object.keys(match).length > 0) pipeline.push({ $match: match });

    const orders = await OrderModel.aggregate(pipeline);

    return res.status(200).json({
      status: "success",
      message: "Filtered orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
