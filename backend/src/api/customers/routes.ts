import { Router } from 'express';
import {
    getNearbyRestaurants,
    getRestaurantMenu,
    placeOrder,
    getOrderHistory,
    getOrderTrackingStatus,
} from './controllers';
import { protect } from '../../shared/auth/AuthMiddleware';
import { cache } from '../../shared/utils/cache';

const customerRouter = Router();

customerRouter.use(protect(['customer']))
customerRouter.get('/restaurants',cache.withTtl('1 hour'), getNearbyRestaurants);
customerRouter.get('/restaurants/:restaurantId/menu',cache.withTtl('30 minutes'), getRestaurantMenu);
customerRouter.get('/orders/history', getOrderHistory);
customerRouter.post('/orders', placeOrder);
customerRouter.get('/orders/:orderId/status', getOrderTrackingStatus);


export default customerRouter;
