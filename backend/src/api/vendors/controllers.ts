import { RestaurantModel, OrderModel } from "../shared/models";
import { Request, Response, NextFunction } from "express";
import { serializeResponse } from "../../profile";
import {
  orderStausSchema,
  addNewItems,
  toggleAvailabilitySchema,
  rejectOrderSchema,
  updateItems,
  toggleActiveSchema,
} from "./schemas";
import { isValidObjectId } from "../../shared/utils/validators";
import { getSocketServerInstance } from "../../shared/utils/socket";

export const vendorDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const restaurantId = req.user?._id;
  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const restaurant = await RestaurantModel.findOne({ owner: restaurantId });
  if (!restaurant) {
    const err = new Error("Restaurant not found") as any;
    err.statusCode = 404;
    return next(err);
  }
  const pendingOrders = await OrderModel.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: "pending",
  });
  const acceptedOrders = await OrderModel.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: "accepted",
  });
  const inTransitOrders = await OrderModel.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: "in-transit",
  });
  const cancelledOrders = await OrderModel.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: "cancelled",
  });
  const completedOrdersToday = await OrderModel.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: "delivered",
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
  });
  return res.json(
    serializeResponse(
      "success",
      {
        restaurant,
        inTransitOrders,
        acceptedOrders,
        cancelledOrders,
        pendingOrders,
        completedOrdersToday,
      },
      "restaurant dashboard"
    )
  );
};

export const addItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const restaurantId = req.user?._id;
  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const parseItemsBody = addNewItems.safeParse(req.body);
  if (!parseItemsBody.success) {
    const issues = parseItemsBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { name, description, price, image, category, isAvailable } =
    parseItemsBody.data;

  const restaurant = await RestaurantModel.findOne({ owner: restaurantId });
  if (!restaurant) {
    const err = new Error("Restaurant not found") as any;
    err.statusCode = 404;
    return next(err);
  }

  const newItem = { name, description, price, image, category, isAvailable };
  restaurant.menu.push(newItem);
  await restaurant.save();
  return res
    .status(201)
    .json(serializeResponse("success", { newItem }, "New Item Added"));
};

export const updateItem = (req: Request, res: Response, next: NextFunction) => {
  const restaurantId = req.user?._id;
  const { itemId } = req.params;

  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  if (!itemId) {
    const err = new Error("Item ID not found in request parameters.") as any;
    err.statusCode = 400;
    return next(err);
  }

  isValidObjectId(itemId);

  const parseUpdateItemBody = updateItems.safeParse(req.body);
  if (!parseUpdateItemBody.success) {
    const issues = parseUpdateItemBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid fields provided: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }

  const itemaFieldsToUpdate = parseUpdateItemBody.data;

  const updateItem = RestaurantModel.findByIdAndUpdate(
    {
      owner: restaurantId,
      "menu._id": itemId,
      menu: [itemaFieldsToUpdate],
    },
    { new: true, runValidators: true }
  );
  if (!updateItem) {
    const err = new Error("Restaurant not found") as any;
    err.statusCode = 404;
    return next(err);
  }

  return res.status(204).end();
};

export const getItem = (req: Request, res: Response, next: NextFunction) => {
  const restaurantId = req.user?._id;
  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const { itemId } = req.params;
  if (!itemId) {
    const err = new Error("Item ID not found in request parameters.") as any;
    err.statusCode = 400;
    return next(err);
  }

  isValidObjectId(itemId);

  const item = RestaurantModel.findOne({
    owner: restaurantId,
    "menu._id": itemId,
  });
  if (!item) {
    const err = new Error("Item not found or not authorized.") as any;
    err.statusCode = 404;
    return next(err);
  }
  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        { item },
        "Details of item retrieved successfully."
      )
    );
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  const restaurantId = req.user?._id;
  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const { itemId } = req.params;
  if (!itemId) {
    const err = new Error("Item ID not found in request parameters.") as any;
    err.statusCode = 400;
    return next(err);
  }

  isValidObjectId(itemId);

  try {
    const itemToRemove = RestaurantModel.findOneAndDelete({
      owner: restaurantId,
      "menu._id": itemId,
    });
    if (!itemToRemove) {
      const err = new Error("Order not found or not authorized.") as any;
      err.statusCode = 404;
      return next(err);
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const orderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const restaurantId = req.user?._id;
  if (!restaurantId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const parsedOrderBody = orderStausSchema.safeParse(req.body);
  if (!parsedOrderBody.success) {
    const issues = parsedOrderBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { status } = parsedOrderBody.data;

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: req.params.orderId, restaurantId: restaurantId },
    { orderStatus: status },
    { new: true, runValidators: true }
  );
  if (!updatedOrder) {
    const err = new Error("Order not found or not authorized.") as any;
    err.statusCode = 404;
    return next(err);
  }
  return res.json(
    serializeResponse(
      "success",
      { order: updatedOrder },
      "Order status updated successfully."
    )
  );
};

export const toggleMenuItemAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.user?._id;
  if (!vendorId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const { itemId } = req.params;

  if (!itemId) {
    const err = new Error("item id required.") as any;
    err.statusCode = 400;
    return next(err);
  }

  const parsedBody = toggleAvailabilitySchema.safeParse(req.body);
  if (!parsedBody.success) {
    const issues = parsedBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }

  const { isAvailable } = parsedBody.data;
  isValidObjectId(itemId);

  try {
    const restaurant = await RestaurantModel.findOneAndUpdate(
      {
        owner: vendorId,
        "menu._id": itemId,
      },
      {
        $set: { "menu.$.isAvailable": isAvailable },
      },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      const err = new Error(
        "Menu item not found or does not belong to this vendor."
      ) as any;
      err.statusCode = 404;
      return next(err);
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const rejectOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.user?._id;
  if (!vendorId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  const { orderId } = req.params;
  if (!orderId) {
    const err = new Error("Id not found.") as any;
    err.statusCode = 401;
    return next(err);
  }
  const parsedBody = rejectOrderSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const issues = parsedBody.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }

  const { reason } = parsedBody.data;
  isValidObjectId(orderId);
  try {
    const order = await OrderModel.findOne({
      _id: orderId,
      restaurantId: vendorId,
      orderStatus: "pending",
    });

    if (!order) {
      const err = new Error(
        "Order not found or not in a pending state."
      ) as any;
      err.statusCode = 404;
      return next(err);
    }
    order.orderStatus = "cancelled";
    order.rejectionReason = reason;
    await order.save();
    const io = getSocketServerInstance();
    io.to(`user_${order.customerId}`).emit("order:status_updated", {
      orderId: order._id,
      newStatus: order.orderStatus,
      reason,
    });

    return res
      .status(200)
      .json(
        serializeResponse("success", { order }, "Order rejected successfully.")
      );
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurantAvailability = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.user?._id;
  if (!vendorId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }
  const getIsActive = toggleActiveSchema.safeParse(req.body);
  if (!getIsActive.success) {
    const issues = getIsActive.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { isActive } = getIsActive.data;
  try {
    const restaurant = RestaurantModel.findByIdAndUpdate(
      {
        owner: vendorId,
      },
      {
        $set: { isActive: isActive },
      },
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      const err = new Error(
        "restaurant not found or does not belong to this vendor."
      ) as any;
      err.statusCode = 404;
      return next(err);
    }
    return res
      .status(200)
      .json(
        serializeResponse("success", null, "Availability updated successfully.")
      );
  } catch (error) {
    next(error);
  }
};

// todo : ...
export const getRatings = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
};
