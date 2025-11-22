import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "../../shared/utils/validators";
import { OrderModel } from "./models";
import { serializeResponse } from "../../profile";

export const getRatings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = (
      req.user && req.user.role === "vendor"
        ? req.user._id
        : req.query.restaurantId
    ) as string;

    if (!restaurantId) {
      const err = new Error("Valid restaurantId is required.") as any;
      err.statusCode = 400;
      return next(err);
    }
    isValidObjectId(restaurantId);

    const ratingsAgg = await OrderModel.aggregate([
      {
        $match: {
          restaurantId: restaurantId,
          rating: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          comments: { $push: "$comment" },
        },
      },
    ]);

    const data =
      ratingsAgg.length > 0
        ? ratingsAgg[0]
        : { averageRating: 0, totalRatings: 0, comments: [] };

    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          data,
          "Restaurant ratings fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const orderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  const userId = req.user?._id;
  const userRole = req.user?.role;

  if (!orderId) {
    const err = new Error("Order ID is required.") as any;
    err.statusCode = 400;
    return next(err);
  }
  if (!userId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }
  isValidObjectId(orderId);

  const baseQuery: any = { _id: orderId };
  if (userRole !== "admin") {
    baseQuery.$or = [
      { customerId: userId },
      { riderId: userId },
      { restaurantId: userId },
    ];
  }
  const order = await OrderModel.findOne(baseQuery);

  if (!order) {
    const err = new Error("Order not found or access denied.") as any;
    err.statusCode = 404;
    return next(err);
  }
  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        { status: order.orderStatus },
        "Order status fetched successfully."
      )
    );
};
