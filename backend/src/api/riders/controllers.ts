import { Response, Request, NextFunction } from "express";
import { OrderModel } from "../shared/models";
import { serializeResponse } from "../../profile";
import { orderStausSchema } from "./schema";
import { isValidObjectId } from "../../shared/utils/validators";
import { getSocketServerInstance } from "../../shared/utils/socket";

export const riderDashBoard = async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error('Authentication failed. Rider ID not found.') as any;
        err.statusCode = 401;
        return next(err);
    }
    const history = await OrderModel.find({ riderId: riderId })
        .sort({ createdAt: -1 })
        .select('orderStatus createdAt deliveryAddress customerId');

    return res.status(200).json(serializeResponse('success', { history }, 'Rider order history retrieved successfully.'));
};

export const viewOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const riderId = req.user?._id;

    if (!riderId) {
        const err = new Error('Authentication failed. Rider ID not found.') as any;
        err.statusCode = 401;
        return next(err);
    }
    if (!orderId) {
        const err = new Error('Order ID not found in request parameters.') as any;
        err.statusCode = 400;
        return next(err);
    }

    isValidObjectId(orderId);

    const orderDetails = await OrderModel.findOne({ _id: orderId, riderId: riderId });
    if (!orderDetails) {
        const err = new Error('Order not found or not authorized.') as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json(serializeResponse('success', { orderDetails }, 'Details of order retrieved successfully.'));
};

export const markStatus = async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user?._id;
    if (!riderId) {
        const err = new Error('Authentication failed. Rider ID not found.') as any;
        err.statusCode = 401;
        return next(err);
    }

    const parsedOrderBody = orderStausSchema.safeParse(req.body);
    if (!parsedOrderBody.success) {
        const issues = parsedOrderBody.error.issues.map(issue => issue.message).join(', ');
        const err = new Error(`Invalid request body: ${issues}`) as any;
        err.statusCode = 400;
        return next(err);
    }
    const { status } = parsedOrderBody.data;

    const { orderId } = req.params;
    if (!orderId) {
        const err = new Error('Order ID not found in request parameters.') as any;
        err.statusCode = 400;
        return next(err);
    }
    
    isValidObjectId(orderId);

    const updatedOrder = await OrderModel.findOneAndUpdate(
        { _id: orderId, riderId: riderId },
        { orderStatus: status },
        { new: true, runValidators: true }
    );

    if (!updatedOrder) {
        const err = new Error('Order not found or not authorized.') as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.json(serializeResponse('success', { order: updatedOrder }, 'Order status updated successfully.'));
};


export const acceptOrderAssignment = async (req: Request, res: Response, next: NextFunction) => {
  const riderId = req.user?._id;
  if (!riderId) {
    const err = new Error('Authentication required.') as any;
    err.statusCode = 401;
    return next(err);
  }
  const { id } = req.params;
  if (!id){
    const err = new Error('id not found') as any;
    err.statusCode = 404;
    return next(err);

  }
  isValidObjectId(id);
  try {
    const order = await OrderModel.findOne({
      _id: id,
      riderId,
      orderStatus: 'accepted',
    });

    if (!order) {
      const err = new Error('Order not found or not available for assignment.') as any;
      err.statusCode = 404;
      return next(err);
    }
    order.orderStatus = 'in-transit';
    order.pickedUpAt = new Date();
    await order.save();
    
    const io = getSocketServerInstance();
    io.to(`user_${order.customerId}`).emit("order:status_updated", { orderId: order._id, newStatus: order.orderStatus });

    return res.status(200).json(serializeResponse('success', { order }, 'Order assignment accepted successfully.'));
  } catch (error) {
    next(error);
  }
};

