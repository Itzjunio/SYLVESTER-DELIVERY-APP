"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRestaurantAvailability = exports.rejectOrder = exports.toggleMenuItemAvailability = exports.orderStatus = exports.deleteItem = exports.getItem = exports.updateItem = exports.addItems = exports.vendorDashboard = void 0;
const models_1 = require("../shared/models");
const profile_1 = require("../../profile");
const schemas_1 = require("./schemas");
const validators_1 = require("../../shared/utils/validators");
const socket_1 = require("../../shared/utils/socket");
const vendorDashboard = async (req, res, next) => {
    const restaurantId = req.user?._id;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const restaurant = await models_1.RestaurantModel.findOne({ owner: restaurantId });
    if (!restaurant) {
        const err = new Error("Restaurant not found");
        err.statusCode = 404;
        return next(err);
    }
    const pendingOrders = await models_1.OrderModel.countDocuments({
        restaurantId: restaurant._id,
        orderStatus: "pending",
    });
    const acceptedOrders = await models_1.OrderModel.countDocuments({
        restaurantId: restaurant._id,
        orderStatus: "accepted",
    });
    const inTransitOrders = await models_1.OrderModel.countDocuments({
        restaurantId: restaurant._id,
        orderStatus: "in-transit",
    });
    const cancelledOrders = await models_1.OrderModel.countDocuments({
        restaurantId: restaurant._id,
        orderStatus: "cancelled",
    });
    const completedOrdersToday = await models_1.OrderModel.countDocuments({
        restaurantId: restaurant._id,
        orderStatus: "delivered",
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    return res.json((0, profile_1.serializeResponse)("success", {
        restaurant,
        inTransitOrders,
        acceptedOrders,
        cancelledOrders,
        pendingOrders,
        completedOrdersToday,
    }, "restaurant dashboard"));
};
exports.vendorDashboard = vendorDashboard;
const addItems = async (req, res, next) => {
    const restaurantId = req.user?._id;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const parseItemsBody = schemas_1.addNewItems.safeParse(req.body);
    if (!parseItemsBody.success) {
        const issues = parseItemsBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { name, description, price, image, category, isAvailable } = parseItemsBody.data;
    const restaurant = await models_1.RestaurantModel.findOne({ owner: restaurantId });
    if (!restaurant) {
        const err = new Error("Restaurant not found");
        err.statusCode = 404;
        return next(err);
    }
    const newItem = { name, description, price, image, category, isAvailable };
    restaurant.menu.push(newItem);
    await restaurant.save();
    return res
        .status(201)
        .json((0, profile_1.serializeResponse)("success", { newItem }, "New Item Added"));
};
exports.addItems = addItems;
const updateItem = (req, res, next) => {
    const restaurantId = req.user?._id;
    const { itemId } = req.params;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    if (!itemId) {
        const err = new Error("Item ID not found in request parameters.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(itemId);
    const parseUpdateItemBody = schemas_1.updateItems.safeParse(req.body);
    if (!parseUpdateItemBody.success) {
        const issues = parseUpdateItemBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid fields provided: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const itemaFieldsToUpdate = parseUpdateItemBody.data;
    const updateItem = models_1.RestaurantModel.findByIdAndUpdate({
        owner: restaurantId,
        "menu._id": itemId,
        menu: [itemaFieldsToUpdate],
    }, { new: true, runValidators: true });
    if (!updateItem) {
        const err = new Error("Restaurant not found");
        err.statusCode = 404;
        return next(err);
    }
    return res.status(204).end();
};
exports.updateItem = updateItem;
const getItem = (req, res, next) => {
    const restaurantId = req.user?._id;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const { itemId } = req.params;
    if (!itemId) {
        const err = new Error("Item ID not found in request parameters.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(itemId);
    const item = models_1.RestaurantModel.findOne({
        owner: restaurantId,
        "menu._id": itemId,
    });
    if (!item) {
        const err = new Error("Item not found or not authorized.");
        err.statusCode = 404;
        return next(err);
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { item }, "Details of item retrieved successfully."));
};
exports.getItem = getItem;
const deleteItem = (req, res, next) => {
    const restaurantId = req.user?._id;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const { itemId } = req.params;
    if (!itemId) {
        const err = new Error("Item ID not found in request parameters.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(itemId);
    try {
        const itemToRemove = models_1.RestaurantModel.findOneAndDelete({
            owner: restaurantId,
            "menu._id": itemId,
        });
        if (!itemToRemove) {
            const err = new Error("Order not found or not authorized.");
            err.statusCode = 404;
            return next(err);
        }
        return res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteItem = deleteItem;
const orderStatus = async (req, res, next) => {
    const restaurantId = req.user?._id;
    if (!restaurantId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const parsedOrderBody = schemas_1.orderStausSchema.safeParse(req.body);
    if (!parsedOrderBody.success) {
        const issues = parsedOrderBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { status } = parsedOrderBody.data;
    const updatedOrder = await models_1.OrderModel.findOneAndUpdate({ _id: req.params.orderId, restaurantId: restaurantId }, { orderStatus: status }, { new: true, runValidators: true });
    if (!updatedOrder) {
        const err = new Error("Order not found or not authorized.");
        err.statusCode = 404;
        return next(err);
    }
    return res.json((0, profile_1.serializeResponse)("success", { order: updatedOrder }, "Order status updated successfully."));
};
exports.orderStatus = orderStatus;
const toggleMenuItemAvailability = async (req, res, next) => {
    const vendorId = req.user?._id;
    if (!vendorId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const { itemId } = req.params;
    if (!itemId) {
        const err = new Error("item id required.");
        err.statusCode = 400;
        return next(err);
    }
    const parsedBody = schemas_1.toggleAvailabilitySchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { isAvailable } = parsedBody.data;
    (0, validators_1.isValidObjectId)(itemId);
    try {
        const restaurant = await models_1.RestaurantModel.findOneAndUpdate({
            owner: vendorId,
            "menu._id": itemId,
        }, {
            $set: { "menu.$.isAvailable": isAvailable },
        }, { new: true, runValidators: true });
        if (!restaurant) {
            const err = new Error("Menu item not found or does not belong to this vendor.");
            err.statusCode = 404;
            return next(err);
        }
        return res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.toggleMenuItemAvailability = toggleMenuItemAvailability;
const rejectOrder = async (req, res, next) => {
    const vendorId = req.user?._id;
    if (!vendorId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const { orderId } = req.params;
    if (!orderId) {
        const err = new Error("Id not found.");
        err.statusCode = 401;
        return next(err);
    }
    const parsedBody = schemas_1.rejectOrderSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { reason } = parsedBody.data;
    (0, validators_1.isValidObjectId)(orderId);
    try {
        const order = await models_1.OrderModel.findOne({
            _id: orderId,
            restaurantId: vendorId,
            orderStatus: "pending",
        });
        if (!order) {
            const err = new Error("Order not found or not in a pending state.");
            err.statusCode = 404;
            return next(err);
        }
        order.orderStatus = "cancelled";
        order.rejectionReason = reason;
        await order.save();
        const io = (0, socket_1.getSocketServerInstance)();
        io.to(`user_${order.customerId}`).emit("order:status_updated", {
            orderId: order._id,
            newStatus: order.orderStatus,
            reason,
        });
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { order }, "Order rejected successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.rejectOrder = rejectOrder;
const toggleRestaurantAvailability = (req, res, next) => {
    const vendorId = req.user?._id;
    if (!vendorId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const getIsActive = schemas_1.toggleActiveSchema.safeParse(req.body);
    if (!getIsActive.success) {
        const issues = getIsActive.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { isActive } = getIsActive.data;
    try {
        const restaurant = models_1.RestaurantModel.findByIdAndUpdate({
            owner: vendorId,
        }, {
            $set: { isActive: isActive },
        }, { new: true, runValidators: true });
        if (!restaurant) {
            const err = new Error("restaurant not found or does not belong to this vendor.");
            err.statusCode = 404;
            return next(err);
        }
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", null, "Availability updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.toggleRestaurantAvailability = toggleRestaurantAvailability;
//# sourceMappingURL=controllers.js.map