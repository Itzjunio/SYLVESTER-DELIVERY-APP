import { Request, Response } from "express";
import { User } from "../../shared/User/UserModels";
import { serializeResponse } from "../../profile";
import { OrderModel } from "../shared/models";

// TODO: VALIDATE ALL INCOMING DATA

export const adminDashBoard = async(_req: Request, res:Response) =>{
  try {
    // todo: { count only customers, rider, venders }
    // todo: { rider current location }
    // todo: { active riders, vendors}
    // todo: { orders placed for the data }
    const Users = await User.countDocuments();
    return res.json(serializeResponse('success', users, "users data"));
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

export const users = async(_req: Request, res:Response) =>{
  try {
    const users = await User.find({}).select('-password');
    return res.json(users);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

export const orders = async(_req: Request, res:Response) =>{
  try {
    const orders = await OrderModel.find({})
      .populate('customer')
      .populate('restaurant')
      .populate('rider');
    return res.json(orders);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

export const orderStatus = async(req: Request, res:Response) =>{
    try {
      let order = await OrderModel.findById(req.params.id);
      if (!order) {
        return res.status(404).json(serializeResponse('error', null, 'Order not found'));
      }
      return res.json(serializeResponse('success', {order}, 'Order data'));
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
}


