"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../../shared/middlewares/AuthMiddleware");
const controllers_1 = require("./controllers");
const sharedRouter = (0, express_1.Router)();
sharedRouter.use((0, AuthMiddleware_1.protect)());
sharedRouter.get("/restaurants/ratings", controllers_1.getRatings);
sharedRouter.get("/orders/:orderId/status", controllers_1.orderStatus);
exports.default = sharedRouter;
//# sourceMappingURL=routes.js.map