import { Router } from "express";
import {
  getNearbyRestaurants,
  getRestaurantMenu,
  placeOrder,
  getOrderHistory,
  getOrderTrackingStatus,
  getCustomerScheduledOrders,
  rating,
  filter
} from "./controllers";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import { cache } from "../../shared/utils/cache";

const customerRouter = Router();

customerRouter.use(protect(["customer"]));
customerRouter.get(
  "/restaurants",
  cache.withTtl("1 hour"),
  getNearbyRestaurants
);
customerRouter.get(
  "/restaurants/:restaurantId/menu",
  cache.withTtl("30 minutes"),
  getRestaurantMenu
);
customerRouter.get("/orders/history", getOrderHistory);
customerRouter.post("/orders", placeOrder);
customerRouter.get("/orders/scheduled", getCustomerScheduledOrders);
customerRouter.get("/orders/:orderId/status", getOrderTrackingStatus);
customerRouter.post("/orders/rating", rating);
customerRouter.post("/restaurants", filter);

export default customerRouter;
