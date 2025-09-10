import { Router } from 'express';
import {
    getNearbyRestaurants,
    getRestaurantMenu,
    placeOrder,
    getOrderHistory,
    getOrderTrackingStatus,
} from './controllers';
import { protect } from '../../shared/auth/AuthMiddleware';


const customerRouter = Router();

customerRouter.use(protect)
customerRouter.get('/restaurants', getNearbyRestaurants);
customerRouter.get('/restaurants/:restaurantId/menu', getRestaurantMenu);
customerRouter.get('/orders/history', getOrderHistory);
customerRouter.post('/orders', placeOrder);
customerRouter.get('/orders/:orderId/status', getOrderTrackingStatus);


export default customerRouter;
