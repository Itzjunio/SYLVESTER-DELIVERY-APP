"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatus = exports.getRatings = void 0;
const validators_1 = require("../../shared/utils/validators");
const models_1 = require("./models");
const profile_1 = require("../../profile");
const getRatings = async (req, res, next) => {
    try {
        const restaurantId = (req.user && req.user.role === "vendor"
            ? req.user._id
            : req.query.restaurantId);
        if (!restaurantId) {
            const err = new Error("Valid restaurantId is required.");
            err.statusCode = 400;
            return next(err);
        }
        (0, validators_1.isValidObjectId)(restaurantId);
        const ratingsAgg = await models_1.OrderModel.aggregate([
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
        const data = ratingsAgg.length > 0
            ? ratingsAgg[0]
            : { averageRating: 0, totalRatings: 0, comments: [] };
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", data, "Restaurant ratings fetched successfully"));
    }
    catch (error) {
        next(error);
    }
};
exports.getRatings = getRatings;
const orderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user?._id;
    const userRole = req.user?.role;
    if (!orderId) {
        const err = new Error("Order ID is required.");
        err.statusCode = 400;
        return next(err);
    }
    if (!userId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(orderId);
    const baseQuery = { _id: orderId };
    if (userRole !== "admin") {
        baseQuery.$or = [
            { customerId: userId },
            { riderId: userId },
            { restaurantId: userId },
        ];
    }
    const order = await models_1.OrderModel.findOne(baseQuery);
    if (!order) {
        const err = new Error("Order not found or access denied.");
        err.statusCode = 404;
        return next(err);
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { status: order.orderStatus }, "Order status fetched successfully."));
};
exports.orderStatus = orderStatus;
//# sourceMappingURL=controllers.js.map