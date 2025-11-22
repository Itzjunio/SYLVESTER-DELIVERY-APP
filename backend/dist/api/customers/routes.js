"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("./controllers");
const AuthMiddleware_1 = require("../../shared/middlewares/AuthMiddleware");
const cache_1 = require("../../shared/utils/cache");
const customerRouter = (0, express_1.Router)();
customerRouter.use((0, AuthMiddleware_1.protect)(["customer"]));
customerRouter.get("/restaurants", cache_1.cache.withTtl("1 hour"), controllers_1.getNearbyRestaurants);
customerRouter.get("/restaurants/:restaurantId/menu", cache_1.cache.withTtl("30 minutes"), controllers_1.getRestaurantMenu);
customerRouter.get("/orders/history", controllers_1.getOrderHistory);
customerRouter.post("/orders", controllers_1.placeOrder);
customerRouter.get("/orders/scheduled", controllers_1.getCustomerScheduledOrders);
customerRouter.post("/orders/rating", controllers_1.rating);
customerRouter.post("/restaurants", controllers_1.filter);
exports.default = customerRouter;
//# sourceMappingURL=routes.js.map