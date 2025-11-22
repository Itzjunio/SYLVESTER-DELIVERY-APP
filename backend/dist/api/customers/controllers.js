"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.rating = exports.getCustomerScheduledOrders = exports.getOrderHistory = exports.getRestaurantMenu = exports.getNearbyRestaurants = exports.placeOrder = void 0;
const models_1 = require("../shared/models");
const schemas_1 = require("./schemas");
const mongoose_1 = require("mongoose");
const profile_1 = require("../../profile");
const socket_1 = require("../../shared/utils/socket");
const validators_1 = require("../../shared/utils/validators");
const placeOrder = async (req, res, next) => {
    const customerId = req.user?._id;
    if (!customerId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const parsedBody = schemas_1.placeOrderSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { restaurantId, items, paymentMethod, scheduled } = parsedBody.data;
    (0, validators_1.isValidObjectId)(restaurantId);
    const restaurant = await models_1.RestaurantModel.findById(restaurantId);
    if (!restaurant) {
        const err = new Error("Restaurant not found.");
        err.statusCode = 404;
        return next(err);
    }
    let calculatedTotalAmount = 0;
    const processedItems = new mongoose_1.Types.DocumentArray([]);
    for (const reqItem of items) {
        const menuItem = restaurant.menu.find((m) => m.name === reqItem.name);
        if (!menuItem || !menuItem.isAvailable) {
            const err = new Error(`Item "${reqItem.name}" is not available or does not exist.`);
            err.statusCode = 400;
            return next(err);
        }
        calculatedTotalAmount += menuItem.price * reqItem.quantity;
        processedItems.push({
            name: menuItem.name,
            quantity: reqItem.quantity,
            price: menuItem.price,
        });
    }
    const newOrder = {
        customerId,
        restaurantId: new mongoose_1.Types.ObjectId(restaurantId),
        items: processedItems,
        totalAmount: calculatedTotalAmount,
        scheduled,
        paymentMethod,
    };
    // Todo: The payment gateway logic is crucial here.
    // The order should only be created in the DB after a successful payment.
    const createdOrder = await models_1.OrderModel.create(newOrder);
    const io = (0, socket_1.getSocketServerInstance)();
    io.to(`user_${customerId}`).emit("orders:new", { order: createdOrder });
    io.to(`restaurant_${restaurantId}`).emit("orders:new", {
        order: createdOrder,
    });
    return res
        .status(201)
        .json((0, profile_1.serializeResponse)("success", { order: createdOrder }, "Order placed successfully."));
};
exports.placeOrder = placeOrder;
const getNearbyRestaurants = async (req, res, next) => {
    const parsedBody = schemas_1.getNearbyRestaurantsSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { latitude, longitude, maxDistanceInMeters } = parsedBody.data;
    const restaurants = await models_1.RestaurantModel.find({
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
        const err = new Error("No restaurants found nearby.");
        err.statusCode = 404;
        return next(err);
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { restaurants }, "Nearby restaurants fetched successfully."));
};
exports.getNearbyRestaurants = getNearbyRestaurants;
const getRestaurantMenu = async (req, res, next) => {
    const { restaurantId } = req.params;
    if (!restaurantId) {
        const err = new Error("Restaurant ID is required.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(restaurantId);
    const restaurant = await models_1.RestaurantModel.findById(restaurantId);
    if (!restaurant) {
        const err = new Error("Restaurant not found.");
        err.statusCode = 404;
        return next(err);
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { menu: restaurant.menu }, "Menu fetched successfully."));
};
exports.getRestaurantMenu = getRestaurantMenu;
const getOrderHistory = async (req, res, next) => {
    const customerId = req.user?._id;
    if (!customerId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const orderHistory = await models_1.OrderModel.find({ customerId });
    if (!orderHistory || orderHistory.length === 0) {
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { orderHistory: [] }, "No order history found."));
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { orderHistory }, "Order history fetched successfully."));
};
exports.getOrderHistory = getOrderHistory;
const getCustomerScheduledOrders = async (req, res, next) => {
    try {
        const customerId = req.user?._id;
        const now = new Date();
        if (!customerId) {
            const err = new Error("Authentication required.");
            err.statusCode = 401;
            return next(err);
        }
        const scheduledOrders = await models_1.OrderModel.find({
            customerId,
            orderStatus: "scheduled",
            scheduledFor: { $gte: now },
        }).sort({ scheduledFor: 1 });
        return res.status(200).json({
            status: "success",
            data: scheduledOrders,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getCustomerScheduledOrders = getCustomerScheduledOrders;
const rating = async (req, res, next) => {
    const parsed = schemas_1.ratingSchema.safeParse(req.body);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => i.message).join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { orderId, rating, comment } = parsed.data;
    const customerId = req.user?.id;
    try {
        const order = await models_1.OrderModel.findOne({ _id: orderId, customerId });
        if (!order) {
            const err = new Error("Order not found or not owned by user");
            err.statusCode = 404;
            return next(err);
        }
        if (order.orderStatus !== "delivered") {
            const err = new Error("You can rate only after the order is delivered");
            err.statusCode = 400;
            return next(err);
        }
        order.rating = rating;
        if (comment !== undefined)
            order.comment = comment;
        await order.save();
        return res.status(200).json({
            status: "success",
            message: "Rating submitted successfully",
            data: { orderId: order._id, rating: order.rating, comment: order.comment },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.rating = rating;
// fixed: ...
const filter = async (req, res, next) => {
    const parsedBody = schemas_1.filterSchema.safeParse(req.query);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { cuisine, minRating, maxDeliveryTime } = parsedBody.data;
    try {
        const pipeline = [
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
        const match = {};
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
        if (Object.keys(match).length > 0)
            pipeline.push({ $match: match });
        const orders = await models_1.OrderModel.aggregate(pipeline);
        return res.status(200).json({
            status: "success",
            message: "Filtered orders fetched successfully.",
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.filter = filter;
//# sourceMappingURL=controllers.js.map