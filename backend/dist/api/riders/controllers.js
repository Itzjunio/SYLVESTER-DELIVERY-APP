"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptOrderAssignment = exports.markStatus = exports.viewOrderDetails = exports.riderDashBoard = void 0;
const models_1 = require("../shared/models");
const profile_1 = require("../../profile");
const schema_1 = require("./schema");
const validators_1 = require("../../shared/utils/validators");
// import { getSocketServerInstance } from "../../shared/utils/socket";
const riderDashBoard = async (req, res, next) => {
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error("Authentication failed. Rider ID not found.");
        err.statusCode = 401;
        return next(err);
    }
    const history = await models_1.OrderModel.find({ riderId: riderId })
        .sort({ createdAt: -1 })
        .select("orderStatus createdAt deliveryAddress customerId");
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { history }, "Rider order history retrieved successfully."));
};
exports.riderDashBoard = riderDashBoard;
const viewOrderDetails = async (req, res, next) => {
    const { orderId } = req.params;
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error("Authentication failed. Rider ID not found.");
        err.statusCode = 401;
        return next(err);
    }
    if (!orderId) {
        const err = new Error("Order ID not found in request parameters.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(orderId);
    const orderDetails = await models_1.OrderModel.findOne({
        _id: orderId,
        riderId: riderId,
    });
    if (!orderDetails) {
        const err = new Error("Order not found or not authorized.");
        err.statusCode = 404;
        return next(err);
    }
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", { orderDetails }, "Details of order retrieved successfully."));
};
exports.viewOrderDetails = viewOrderDetails;
const markStatus = async (req, res, next) => {
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error("Authentication failed. Rider ID not found.");
        err.statusCode = 401;
        return next(err);
    }
    const parsedOrderBody = schema_1.orderStausSchema.safeParse(req.body);
    if (!parsedOrderBody.success) {
        const issues = parsedOrderBody.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { status } = parsedOrderBody.data;
    const { orderId } = req.params;
    if (!orderId) {
        const err = new Error("Order ID not found in request parameters.");
        err.statusCode = 400;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(orderId);
    const updatedOrder = await models_1.OrderModel.findOneAndUpdate({ _id: orderId, riderId: riderId }, { orderStatus: status }, { new: true, runValidators: true });
    if (!updatedOrder) {
        const err = new Error("Order not found or not authorized.");
        err.statusCode = 404;
        return next(err);
    }
    return res.json((0, profile_1.serializeResponse)("success", { order: updatedOrder }, "Order status updated successfully."));
};
exports.markStatus = markStatus;
const acceptOrderAssignment = async (req, res, next) => {
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const { id } = req.params;
    if (!id) {
        const err = new Error("id not found");
        err.statusCode = 404;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(id);
    try {
        const order = await models_1.OrderModel.findOne({
            _id: id,
            riderId,
            orderStatus: "accepted",
        });
        if (!order) {
            const err = new Error("Order not found or not available for assignment.");
            err.statusCode = 404;
            return next(err);
        }
        order.orderStatus = "in-transit";
        order.pickedUpAt = new Date();
        await order.save();
        // const io = getSocketServerInstance();
        // io.to(`user_${order.customerId}`).emit("order:status_updated", {
        //   orderId: order._id,
        //   newStatus: order.orderStatus,
        // });
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", { order }, "Order assignment accepted successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.acceptOrderAssignment = acceptOrderAssignment;
//# sourceMappingURL=controllers.js.map