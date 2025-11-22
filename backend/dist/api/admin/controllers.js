"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDispute = exports.disputes = exports.notify = exports.commission = exports.assignRider = exports.getAllRidersPerformanceReport = exports.deactivateUser = exports.getRiderPerformanceReport = exports.orders = exports.users = exports.adminStats = void 0;
const UserModels_1 = require("../../shared/User/UserModels");
const profile_1 = require("../../profile");
const models_1 = require("../shared/models");
const validators_1 = require("../../shared/utils/validators");
const schema_1 = require("./schema");
const models_2 = require("../shared/models");
const fcmModels_1 = require("../../shared/notifications/fcmModels");
const fcmService_1 = require("../../shared/notifications/fcmService");
const adminStats = async (_req, res) => {
    try {
        const totalUsers = await UserModels_1.User.countDocuments();
        const [customers, vendors, riders, admins] = await Promise.all([
            UserModels_1.User.countDocuments({ role: "customer" }),
            UserModels_1.User.countDocuments({ role: "vendor" }),
            UserModels_1.User.countDocuments({ role: "rider" }),
            UserModels_1.User.countDocuments({ role: "admin" }),
        ]);
        const totalRestaurants = await models_2.RestaurantModel.countDocuments();
        const [totalOrders, deliveredOrders, pendingOrders, cancelledOrders] = await Promise.all([
            models_1.OrderModel.countDocuments(),
            models_1.OrderModel.countDocuments({ orderStatus: "delivered" }),
            models_1.OrderModel.countDocuments({ orderStatus: "pending" }),
            models_1.OrderModel.countDocuments({ orderStatus: "cancelled" }),
        ]);
        const revenueAgg = await models_1.OrderModel.aggregate([
            { $match: { orderStatus: "delivered", paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;
        const [totalPayouts, processedPayouts, pendingPayouts] = await Promise.all([
            models_2.PayOutModel.countDocuments(),
            models_2.PayOutModel.countDocuments({ status: "processed" }),
            models_2.PayOutModel.countDocuments({ status: "pending" }),
        ]);
        const [openDisputes, resolvedDisputes] = await Promise.all([
            models_2.DisputeModel.countDocuments({ status: "pending" }),
            models_2.DisputeModel.countDocuments({ status: "resolved" }),
        ]);
        const activeDevices = await fcmModels_1.DeviceToken.countDocuments();
        return res.json((0, profile_1.serializeResponse)("success", {
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
        }, "Admin dashboard statistics fetched successfully"));
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json((0, profile_1.serializeResponse)("error", null, "Failed to fetch admin statistics"));
    }
};
exports.adminStats = adminStats;
const users = async (_req, res) => {
    const users = await UserModels_1.User.find({}).select("-password");
    return res.json((0, profile_1.serializeResponse)("success", { users }, "Users data"));
};
exports.users = users;
const orders = async (_req, res) => {
    const orders = await models_1.OrderModel.find({})
        .populate({ path: "customerId", select: "email mobile" })
        .populate({ path: "restaurantId", select: "name address" })
        .populate({ path: "riderId", select: "email mobile" });
    return res.json((0, profile_1.serializeResponse)("success", { orders }, "Orders data"));
};
exports.orders = orders;
const getRiderPerformanceReport = async (req, res, next) => {
    const parsedQuery = schema_1.riderPerformanceSchema.safeParse(req.query);
    if (!parsedQuery.success) {
        const issues = parsedQuery.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid query parameters: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { startDate, endDate, riderId } = parsedQuery.data;
    try {
        const query = {
            orderStatus: { $in: ["delivered", "cancelled"] },
        };
        if (riderId) {
            (0, validators_1.isValidObjectId)(riderId);
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
        const riderPerformance = await models_1.OrderModel.aggregate([
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
                .json((0, profile_1.serializeResponse)("success", { riderPerformance: [] }, "No performance data found for the given criteria."));
        }
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { riderPerformance }, "Rider performance report fetched successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.getRiderPerformanceReport = getRiderPerformanceReport;
const deactivateUser = async (req, res, next) => {
    const { userId } = req.params;
    if (userId) {
        (0, validators_1.isValidObjectId)(userId);
    }
    try {
        const user = await UserModels_1.User.findById(userId);
        if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            return next(err);
        }
        user.isActive = false;
        await user.save();
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { user }, "User account deactivated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateUser = deactivateUser;
const getAllRidersPerformanceReport = async (req, res, next) => {
    const parsedQuery = schema_1.riderPerformanceSchema
        .omit({ riderId: true })
        .safeParse(req.query);
    if (!parsedQuery.success) {
        const issues = parsedQuery.error.issues.map((i) => i.message).join(", ");
        const err = new Error(`Invalid query parameters: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { startDate, endDate } = parsedQuery.data;
    try {
        const query = {
            orderStatus: { $in: ["delivered", "cancelled"] },
        };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const ridersPerformance = await models_1.OrderModel.aggregate([
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
            .json((0, profile_1.serializeResponse)("success", { ridersPerformance }, ridersPerformance.length
            ? "All riders performance report fetched successfully."
            : "No performance data found for the given criteria."));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllRidersPerformanceReport = getAllRidersPerformanceReport;
const assignRider = async (req, res, next) => {
    const { id } = req.params;
    const adminId = req.user?._id;
    const { riderId } = req.body;
    if (!adminId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    if (!id || !riderId) {
        const err = new Error("order Id or rider Id required.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(id);
    (0, validators_1.isValidObjectId)(riderId);
    try {
        const order = await models_1.OrderModel.findById(id);
        if (!order) {
            const err = new Error("Order not found.");
            err.statusCode = 404;
            return next(err);
        }
        order.riderId = riderId;
        order.assignedBy = adminId;
        order.orderStatus = "accepted";
        await order.save();
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { order }, "Rider assigned successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.assignRider = assignRider;
const commission = async (req, res, next) => {
    const { restaurantId } = req.params;
    const { commissionRate } = req.body;
    try {
        if (!restaurantId) {
            const err = new Error("Restaurant ID required.");
            err.statusCode = 400;
            return next(err);
        }
        if (typeof commissionRate !== "number" ||
            commissionRate < 0 ||
            commissionRate > 100) {
            const err = new Error("Commission rate must be a number between 0-100.");
            err.statusCode = 400;
            return next(err);
        }
        const restaurant = await models_2.RestaurantModel.findByIdAndUpdate(restaurantId, { commissionRate }, { new: true });
        if (!restaurant) {
            const err = new Error("Restaurant not found.");
            err.statusCode = 404;
            return next(err);
        }
        return res.json((0, profile_1.serializeResponse)("success", { restaurant }, "Commission updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.commission = commission;
const notify = async (req, res, next) => {
    const { title, message, topic, userIds } = req.body;
    try {
        if (!title || !message) {
            const err = new Error("Title and message are required.");
            err.statusCode = 400;
            return next(err);
        }
        if (topic && userIds) {
            const err = new Error("Provide only one: either 'topic' or 'userIds'.");
            err.statusCode = 400;
            return next(err);
        }
        if (topic) {
            await (0, fcmService_1.sendToTopic)(topic, { title, body: message }, {});
            return res.json((0, profile_1.serializeResponse)("success", { topic }, `Notification sent to topic: ${topic}`));
        }
        if (Array.isArray(userIds) && userIds.length > 0) {
            const results = await Promise.allSettled(userIds.map((id) => (0, fcmService_1.sendPushNotification)(id, { title, body: message }, {})));
            let totalSent = 0;
            let totalRemoved = 0;
            results.forEach((r) => {
                if (r.status === "fulfilled") {
                    totalSent += r.value.sent;
                    totalRemoved += r.value.removed;
                }
            });
            return res.json((0, profile_1.serializeResponse)("success", { totalSent, totalRemoved, userCount: userIds.length }, "Notifications sent successfully."));
        }
        const err = new Error("Please provide either 'topic' or 'userIds'.");
        err.statusCode = 400;
        return next(err);
    }
    catch (error) {
        next(error);
    }
};
exports.notify = notify;
const disputes = async (req, res, next) => {
    const { status } = req.query;
    try {
        const filter = {};
        if (status)
            filter.status = status;
        const disputes = await models_2.DisputeModel.find(filter);
        return res.json((0, profile_1.serializeResponse)("success", { disputes }, "Disputes fetched successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.disputes = disputes;
const resolveDispute = async (req, res, next) => {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    try {
        if (!id) {
            const err = new Error("dispute ID.");
            err.statusCode = 400;
            return next(err);
        }
        const dispute = await models_2.DisputeModel.findById(id);
        if (!dispute) {
            const err = new Error("Dispute not found.");
            err.statusCode = 404;
            return next(err);
        }
        dispute.status = "resolved";
        dispute.resolutionNotes = resolutionNotes || "Resolved by admin";
        await dispute.save();
        return res.json((0, profile_1.serializeResponse)("success", { dispute }, "Dispute resolved successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.resolveDispute = resolveDispute;
//# sourceMappingURL=controllers.js.map