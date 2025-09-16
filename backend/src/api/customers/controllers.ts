import { Request, Response, NextFunction } from 'express';
import { RestaurantModel, OrderModel } from '../shared/models';
import { placeOrderSchema, getNearbyRestaurantsSchema } from './schemas';
import { Types } from 'mongoose';
import { IMenuItem } from '../../types/';
import { serializeResponse } from '../../profile';
import { getSocketServerInstance } from '../../shared/utils/socket';
import { isValidObjectId } from '../../shared/utils/validators';


export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?._id;
    if (!customerId) {
        const err = new Error('Authentication required.') as any;
        err.statusCode = 401;
        return next(err);
    }

    const parsedBody = placeOrderSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
        const err = new Error(`Invalid request body: ${issues}`) as any;
        err.statusCode = 400;
        return next(err);
    }
    const { restaurantId, items, paymentMethod } = parsedBody.data;

    isValidObjectId(restaurantId);

    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
        const err = new Error('Restaurant not found.') as any;
        err.statusCode = 404;
        return next(err);
    }

    let calculatedTotalAmount = 0;
    const processedItems: Types.DocumentArray<IMenuItem> = new Types.DocumentArray<IMenuItem>([]);

    for (const reqItem of items) {
        const menuItem = restaurant.menu.find(m => m.name === reqItem.name);
        if (!menuItem || !menuItem.isAvailable) {
            const err = new Error(`Item "${reqItem.name}" is not available or does not exist.`) as any;
            err.statusCode = 400;
            return next(err);
        }
        calculatedTotalAmount += menuItem.price * reqItem.quantity;
        processedItems.push({
            name: menuItem.name,
            quantity: reqItem.quantity,
            price: menuItem.price,
        } as any);
    }

    const newOrder = {
        customerId,
        restaurantId: new Types.ObjectId(restaurantId),
        items: processedItems,
        totalAmount: calculatedTotalAmount,
        paymentMethod,
    };

    // Todo: The payment gateway logic is crucial here.
    // The order should only be created in the DB after a successful payment.
    const createdOrder = await OrderModel.create(newOrder);
    const io = getSocketServerInstance();
    io.to(`user_${customerId}`).emit("orders:new", { order: createdOrder });
    io.to(`restaurant_${restaurantId}`).emit("orders:new", { order: createdOrder });

    return res.status(201).json(serializeResponse('success', { order: createdOrder }, 'Order placed successfully.'));
};

export const getNearbyRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = getNearbyRestaurantsSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
        const err = new Error(`Invalid request body: ${issues}`) as any;
        err.statusCode = 400;
        return next(err);
    }
    const { latitude, longitude, maxDistanceInMeters } = parsedBody.data;
    const restaurants = await RestaurantModel.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
                $maxDistance: maxDistanceInMeters,
            },
        },
    });
    if (!restaurants || restaurants.length === 0) {
        const err = new Error('No restaurants found nearby.') as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json(serializeResponse('success', { restaurants }, 'Nearby restaurants fetched successfully.'));
};

export const getRestaurantMenu = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;

    if (!restaurantId) {
        const err = new Error('Restaurant ID is required.') as any;
        err.statusCode = 400;
        return next(err);
    }

    isValidObjectId(restaurantId);

    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
        const err = new Error('Restaurant not found.') as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json(serializeResponse('success', { menu: restaurant.menu }, 'Menu fetched successfully.'));
};

export const getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?._id;
    if (!customerId) {
        const err = new Error('Authentication required.') as any;
        err.statusCode = 401;
        return next(err);
    }
    const orderHistory = await OrderModel.find({ customerId });
    if (!orderHistory || orderHistory.length === 0) {
        return res.status(200).json(serializeResponse('success', { orderHistory: [] }, 'No order history found.'));
    }
    return res.status(200).json(serializeResponse('success', { orderHistory }, 'Order history fetched successfully.'));
};

export const getOrderTrackingStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const customerId = req.user?._id;

    if (!orderId) {
        const err = new Error('Order ID is required.') as any;
        err.statusCode = 400;
        return next(err);
    }
    if (!customerId) {
        const err = new Error('Authentication required.') as any;
        err.statusCode = 401;
        return next(err);
    }

    isValidObjectId(orderId);

    const order = await OrderModel.findOne({ _id: orderId, customerId: customerId });
    if (!order) {
        const err = new Error('Order not found or does not belong to this user.') as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json(serializeResponse('success', { status: order.orderStatus }, 'Order status fetched successfully.'));
};