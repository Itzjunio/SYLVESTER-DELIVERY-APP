import { Request, Response } from 'express';
import { RestaurantModel, OrderModel } from './models';
import { placeOrderSchema, getNearbyRestaurantsSchema } from './schemas';
import mongoose , {Types} from 'mongoose';
import { IMenuItem } from '../../types/';
import { serializeResponse } from '../../profile';
import { getSocketServerInstance } from '../../shared/utils/socket';



export const placeOrder = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?._id;
        if (!customerId) {
            return res.status(401).json(serializeResponse('error', null, 'Authentication required.'));
        }

        const parsedBody = placeOrderSchema.safeParse(req.body);
        if (!parsedBody.success) {
            const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
            return res.status(400).json(serializeResponse('error', null, `Invalid request body: ${issues}`));
        }
        const { restaurantId, items, paymentMethod } = parsedBody.data;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json(serializeResponse('error', null, 'Invalid restaurant ID format.'));
        }
        const restaurant = await RestaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json(serializeResponse('error', null, 'Restaurant not found.'));
        }

        let calculatedTotalAmount = 0;
        const processedItems: Types.DocumentArray<IMenuItem> = new Types.DocumentArray<IMenuItem>([]);
        for (const reqItem of items) {
            const menuItem = restaurant.menu.find(m => m.name === reqItem.name);
            if (!menuItem || !menuItem.isAvailable) {
                return res.status(400).json(serializeResponse('error', null, `Item "${reqItem.name}" is not available or does not exist.`));
            }
            calculatedTotalAmount += menuItem.price * reqItem.quantity;
            processedItems.push({
                name: menuItem.name,
                quantity: reqItem.quantity,
                price: menuItem.price
            } as any);
        };
        
        const newOrder = {
            customerId,
            restaurantId: new Types.ObjectId(restaurantId),
            items: processedItems,
            totalAmount: calculatedTotalAmount,
            paymentMethod,
        };

        const createdOrder = await OrderModel.create(newOrder);
        const io = getSocketServerInstance();
        // TODO: Integrate with a payment gateway and handle success/failure
        // The order should only be created in the DB AFTER a successful payment.
        // const paymentResult = await processPayment(paymentMethod, calculatedTotalAmount);
        // if (paymentResult.success) {
            //     const createdOrder = await OrderModel.create(newOrder);
            // return res.status(201).json(serializeResponse('success', { order: createdOrder }, 'Order placed successfully.'));
            // } else {
                //     return res.status(400).json({ message: 'Payment failed.' });
                // }
        io.to(`user_${customerId}`).emit("orders:new", { order: createdOrder });
        io.to(`restaurant_${restaurantId}`).emit("orders:new", { order: createdOrder });
        return res.status(201).json({
            message: 'Order placed successfully.',
            data: createdOrder,
        });

    } catch (error: unknown) {
        console.error('Error placing order:', error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};

export const getNearbyRestaurants = async (req: Request, res: Response) => {
    try {
        const parsedBody = getNearbyRestaurantsSchema.safeParse(req.body);
        if (!parsedBody.success) {
            const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
            return res.status(400).json(serializeResponse('error', null, `Invalid request body: ${issues}`));
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
            return res.status(404).json(serializeResponse('error', null, 'No restaurants found nearby.'));
        }
        return res.status(200).json(serializeResponse('success', { restaurants }, 'Nearby restaurants fetched successfully.'));

    } catch (error: unknown) {
        console.error('Error fetching nearby restaurants:', error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};


export const getRestaurantMenu = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json(serializeResponse('error', null, 'Restaurant ID is required.'));
        }

        const restaurant = await RestaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json(serializeResponse('error', null, 'Restaurant not found.'));
        }
        return res.status(200).json(serializeResponse('success', { menu: restaurant.menu }, 'Menu fetched successfully.'));

    } catch (error: unknown) {
        console.error('Error fetching menu:', error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};


export const getOrderHistory = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?._id;
        if (!customerId) {
            return res.status(401).json(serializeResponse('error', null, 'Authentication required.'));
        }
        const orderHistory = await OrderModel.find({ customerId });
        if (!orderHistory || orderHistory.length === 0) {
            return res.status(404).json(serializeResponse('error', null, 'No order history found.'));
        }

        return res.status(200).json(serializeResponse('success', { orderHistory }, 'Order history fetched successfully.'));

    } catch (error: unknown) {
        console.error('Error fetching order history:', error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};


export const getOrderTrackingStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const customerId = req.user?._id;
        if (!orderId) {
            return res.status(400).json(serializeResponse('error', null, 'Order ID is required.'));
        }
        const order = await OrderModel.findOne({ _id: orderId, customerId: customerId });
        if (!order) {
            return res.status(404).json(serializeResponse('error', null, 'Order not found or does not belong to this user.'));
        }
        return res.status(200).json(serializeResponse('success', { status: order.orderStatus }, 'Order status fetched successfully.'));
    } catch (error: unknown) {
        console.error('Error fetching order status:', error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};


