import { RestaurantModel, OrderModel } from "../shared/models";
import { Request, Response } from "express";
import { serializeResponse } from "../../profile";

// TODO: VALIDATE ALL INCOMING DATA


export const vendorDashboard = async(req: Request, res: Response) =>{
  try {
    const restaurantId = req.user?._id;
    const restaurant = await RestaurantModel.findOne({ owner: restaurantId });
    if (!restaurant) {
      return res.status(404).json(serializeResponse('error', null, 'Restaurant not found'));
    }
    const pendingOrders = await OrderModel.countDocuments({
      restaurantId: restaurant._id,
      orderStatus: 'pending'
    });
    const completedOrdersToday = await OrderModel.countDocuments({
      restaurantId: restaurant._id,
      orderStatus: 'delivered',
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    return res.json({ restaurant, pendingOrders, completedOrdersToday });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

export const menuItems = async(req: Request, res: Response) =>{
  try {
    const restaurantId = req.user?._id;
    const {  name, description, price, image, category, isAvailable} = req.body;
    const restaurant = await RestaurantModel.findOne({ owner: restaurantId });
    if (!restaurant) {
      return res.status(404).json(serializeResponse('error', null, 'Restaurant not found'));
    }
    const newItem = {  name, description, price, image, category, isAvailable };
    restaurant.menu.push(newItem);
    await restaurant.save();
    return res.status(201).json(serializeResponse('success', {newItem}, 'New Item Added'));
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}

export const orderStatus = async(req: Request, res: Response) =>{

  try {
    const { status } = req.body;
    const restaurantId = req.user?._id;
    let order = await OrderModel.findById(req.params.id).populate('restaurant');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.restaurantId !== restaurantId) {
      return res.status(401).json(serializeResponse('error', null, 'Not authorized' ));
    }
    order.orderStatus = status;
    await order.save();
    return res.json(serializeResponse('success', {order}, 'Order Current status'));
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
  }
}


