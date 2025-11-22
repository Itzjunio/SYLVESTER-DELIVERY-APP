"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../../shared/middlewares/AuthMiddleware");
const controllers_1 = require("./controllers");
const riderRouter = (0, express_1.Router)();
riderRouter.use((0, AuthMiddleware_1.protect)(["rider"]));
riderRouter.get("/me", controllers_1.riderDashBoard);
riderRouter.get("/orders/:orderId", controllers_1.viewOrderDetails);
riderRouter.put("/orders/:orderId/assign", controllers_1.acceptOrderAssignment);
riderRouter.patch("/orders/:orderId/status", controllers_1.markStatus);
exports.default = riderRouter;
//# sourceMappingURL=routes.js.map