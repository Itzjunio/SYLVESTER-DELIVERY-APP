import { Request, Response, NextFunction } from "express";
import { User } from "../../shared/User/UserModels";
import { serializeResponse } from "../../profile";
import { OrderModel } from "../shared/models";
import { isValidObjectId } from "../../shared/utils/validators";
import { riderPerformanceSchema } from "./schema";
import { RestaurantModel, PayOutModel, DisputeModel } from "../shared/models";
import { DeviceToken } from "../../shared/notifications/fcmModels";
import {
  sendPushNotification,
  sendToTopic,
} from "../../shared/notifications/fcmService";

export const adminStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const [customers, vendors, riders, admins] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "vendor" }),
      User.countDocuments({ role: "rider" }),
      User.countDocuments({ role: "admin" }),
    ]);
    const totalRestaurants = await RestaurantModel.countDocuments();

    const [totalOrders, deliveredOrders, pendingOrders, cancelledOrders] =
      await Promise.all([
        OrderModel.countDocuments(),
        OrderModel.countDocuments({ orderStatus: "delivered" }),
        OrderModel.countDocuments({ orderStatus: "pending" }),
        OrderModel.countDocuments({ orderStatus: "cancelled" }),
      ]);
    const revenueAgg = await OrderModel.aggregate([
      { $match: { orderStatus: "delivered", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const [totalPayouts, processedPayouts, pendingPayouts] = await Promise.all([
      PayOutModel.countDocuments(),
      PayOutModel.countDocuments({ status: "processed" }),
      PayOutModel.countDocuments({ status: "pending" }),
    ]);

    const [openDisputes, resolvedDisputes] = await Promise.all([
      DisputeModel.countDocuments({ status: "pending" }),
      DisputeModel.countDocuments({ status: "resolved" }),
    ]);
    const activeDevices = await DeviceToken.countDocuments();

    return res.json(
      serializeResponse(
        "success",
        {
          users: {
            total: totalUsers,
            customers,
            vendors,
            riders,
            admins,
          },
          restaurants: totalRestaurants,
          orders: {
            total: totalOrders,
            delivered: deliveredOrders,
            pending: pendingOrders,
            cancelled: cancelledOrders,
          },
          revenue: totalRevenue,
          payouts: {
            total: totalPayouts,
            processed: processedPayouts,
            pending: pendingPayouts,
          },
          disputes: {
            open: openDisputes,
            resolved: resolvedDisputes,
          },
          devices: activeDevices,
        },
        "Admin dashboard statistics fetched successfully"
      )
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        serializeResponse("error", null, "Failed to fetch admin statistics")
      );
  }
};

export const users = async (_req: Request, res: Response) => {
  const users = await User.find({}).select("-password");
  return res.json(serializeResponse("success", { users }, "Users data"));
};

export const orders = async (_req: Request, res: Response) => {
  const orders = await OrderModel.find({})
    .populate({ path: "customerId", select: "email mobile" })
    .populate({ path: "restaurantId", select: "name address" })
    .populate({ path: "riderId", select: "email mobile" });
  return res.json(serializeResponse("success", { orders }, "Orders data"));
};

export const getRiderPerformanceReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedQuery = riderPerformanceSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    const issues = parsedQuery.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid query parameters: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { startDate, endDate, riderId } = parsedQuery.data;
  try {
    const query: any = {
      orderStatus: { $in: ["delivered", "cancelled"] },
    };

    if (riderId) {
      isValidObjectId(riderId);
      query.riderId = riderId;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const riderPerformance = await OrderModel.aggregate([
      { $match: { ...query, riderId: { $ne: null } } },
      {
        $group: {
          _id: "$riderId",
          totalDeliveries: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          totalCancellations: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
          totalDeliveryTime: {
            $sum: {
              $cond: {
                if: { $eq: ["$orderStatus", "delivered"] },
                then: { $subtract: ["$deliveredAt", "$pickedUpAt"] },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalDeliveries: 1,
          totalCancellations: 1,
          averageDeliveryTimeMinutes: {
            $cond: [
              { $eq: ["$totalDeliveries", 0] },
              0,
              {
                $divide: [
                  { $divide: ["$totalDeliveryTime", 60000] },
                  "$totalDeliveries",
                ],
              },
            ],
          },
        },
      },
    ]);

    if (!riderPerformance || riderPerformance.length === 0) {
      return res
        .status(200)
        .json(
          serializeResponse(
            "success",
            { riderPerformance: [] },
            "No performance data found for the given criteria."
          )
        );
    }

    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          { riderPerformance },
          "Rider performance report fetched successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  if (userId) {
    isValidObjectId(userId);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("User not found.") as any;
      err.statusCode = 404;
      return next(err);
    }
    user.isActive = false;
    await user.save();

    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          { user },
          "User account deactivated successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getAllRidersPerformanceReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedQuery = riderPerformanceSchema
    .omit({ riderId: true })
    .safeParse(req.query);

  if (!parsedQuery.success) {
    const issues = parsedQuery.error.issues.map((i) => i.message).join(", ");
    const err = new Error(`Invalid query parameters: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }

  const { startDate, endDate } = parsedQuery.data;

  try {
    const query: any = {
      orderStatus: { $in: ["delivered", "cancelled"] },
    };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const ridersPerformance = await OrderModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$riderId",
          totalDeliveries: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          totalCancellations: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
          totalDeliveryTime: {
            $sum: {
              $cond: {
                if: { $eq: ["$orderStatus", "delivered"] },
                then: { $subtract: ["$deliveredAt", "$pickedUpAt"] },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalDeliveries: 1,
          totalCancellations: 1,
          averageDeliveryTimeMinutes: {
            $cond: [
              { $eq: ["$totalDeliveries", 0] },
              0,
              {
                $divide: [
                  { $divide: ["$totalDeliveryTime", 60000] },
                  "$totalDeliveries",
                ],
              },
            ],
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          { ridersPerformance },
          ridersPerformance.length
            ? "All riders performance report fetched successfully."
            : "No performance data found for the given criteria."
        )
      );
  } catch (error) {
    next(error);
  }
};

export const assignRider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const adminId = req.user?._id;
  const { riderId } = req.body;

  if (!adminId) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }

  if (!id || !riderId) {
    const err = new Error("order Id or rider Id required.") as any;
    err.statusCode = 400;
    return next(err);
  }
  isValidObjectId(id);
  isValidObjectId(riderId);
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      const err = new Error("Order not found.") as any;
      err.statusCode = 404;
      return next(err);
    }

    order.riderId = riderId;
    order.assignedBy = adminId;
    order.orderStatus = "accepted";
    await order.save();

    return res
      .status(200)
      .json(
        serializeResponse("success", { order }, "Rider assigned successfully.")
      );
  } catch (error) {
    next(error);
  }
};

export const commission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  const { commissionRate } = req.body;

  try {
    if (!restaurantId) {
      const err = new Error("Restaurant ID required.") as any;
      err.statusCode = 400;
      return next(err);
    }
    if (
      typeof commissionRate !== "number" ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      const err = new Error(
        "Commission rate must be a number between 0-100."
      ) as any;
      err.statusCode = 400;
      return next(err);
    }

    const restaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { commissionRate },
      { new: true }
    );

    if (!restaurant) {
      const err = new Error("Restaurant not found.") as any;
      err.statusCode = 404;
      return next(err);
    }

    return res.json(
      serializeResponse(
        "success",
        { restaurant },
        "Commission updated successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

export const notify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, message, topic, userIds } = req.body;

  try {
    if (!title || !message) {
      const err = new Error("Title and message are required.") as any;
      err.statusCode = 400;
      return next(err);
    }
    if (topic && userIds) {
      const err = new Error(
        "Provide only one: either 'topic' or 'userIds'."
      ) as any;
      err.statusCode = 400;
      return next(err);
    }

    if (topic) {
      await sendToTopic(topic, { title, body: message }, {});
      return res.json(
        serializeResponse(
          "success",
          { topic },
          `Notification sent to topic: ${topic}`
        )
      );
    }
    if (Array.isArray(userIds) && userIds.length > 0) {
      const results = await Promise.allSettled(
        userIds.map((id) =>
          sendPushNotification(id, { title, body: message }, {})
        )
      );

      let totalSent = 0;
      let totalRemoved = 0;

      results.forEach((r) => {
        if (r.status === "fulfilled") {
          totalSent += r.value.sent;
          totalRemoved += r.value.removed;
        }
      });

      return res.json(
        serializeResponse(
          "success",
          { totalSent, totalRemoved, userCount: userIds.length },
          "Notifications sent successfully."
        )
      );
    }

    const err = new Error("Please provide either 'topic' or 'userIds'.") as any;
    err.statusCode = 400;
    return next(err);
  } catch (error) {
    next(error);
  }
};

export const disputes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.query;
  try {
    const filter: any = {};
    if (status) filter.status = status;

    const disputes = await DisputeModel.find(filter);
    return res.json(
      serializeResponse(
        "success",
        { disputes },
        "Disputes fetched successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

export const resolveDispute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { resolutionNotes } = req.body;

  try {
    if (!id) {
      const err = new Error("dispute ID.") as any;
      err.statusCode = 400;
      return next(err);
    }

    const dispute = await DisputeModel.findById(id);
    if (!dispute) {
      const err = new Error("Dispute not found.") as any;
      err.statusCode = 404;
      return next(err);
    }

    dispute.status = "resolved";
    dispute.resolutionNotes = resolutionNotes || "Resolved by admin";
    await dispute.save();

    return res.json(
      serializeResponse(
        "success",
        { dispute },
        "Dispute resolved successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

