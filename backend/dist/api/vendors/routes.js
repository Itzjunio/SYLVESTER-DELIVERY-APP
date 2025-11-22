"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../../shared/middlewares/AuthMiddleware");
const controllers_1 = require("./controllers");
const venderRouter = (0, express_1.Router)();
venderRouter.use((0, AuthMiddleware_1.protect)(["vendor"]));
venderRouter.get("/dashboard", controllers_1.vendorDashboard);
venderRouter.get("/menu/items/itemId", controllers_1.getItem);
venderRouter.post("/menu/items", controllers_1.addItems);
venderRouter.patch("/menu/items/:itemId", controllers_1.updateItem);
venderRouter.delete("/menu/items/:itemId", controllers_1.deleteItem);
venderRouter.patch("/orders/:orderId/status", controllers_1.orderStatus);
venderRouter.put("/orders/:orderId/actions/reject", controllers_1.rejectOrder);
venderRouter.patch("/menu/items/:itemId/availability", controllers_1.toggleMenuItemAvailability);
venderRouter.patch("/availability", controllers_1.toggleRestaurantAvailability);
exports.default = venderRouter;
//# sourceMappingURL=routes.js.map