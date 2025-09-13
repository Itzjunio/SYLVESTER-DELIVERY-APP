import { Response, Request } from "express";
import { OrderModel } from "../shared/models";
import { serializeResponse } from "../../profile";

// TODO: VALIDATE ALL INCOMING DATA

export const orderAssigned = async(req: Request, res: Response) =>{
  try {
    const  riderId  = req.user?._id;
    const orders = await OrderModel.find({
      riderId: riderId,
      orderStatus: { $in: ['accepted', 'picked_up'] }
    }).populate('restaurant');
    res.json(serializeResponse('success', {orders}, 'Order Assigned'));
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

export const orderStatus = async(req: Request, res: Response) =>{
  try {
    const  riderId  = req.user?._id;
    const { status } = req.body;
    let order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json(serializeResponse('error', null , 'Order not found' ));
    }

    if (order.riderId !== riderId) {
      return res.status(401).json(serializeResponse('error', null, 'Not authorized' ));
    }
    order.orderStatus = status;
    await order.save();
    return res.json(serializeResponse('success', {order}, 'Order given status'));
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

