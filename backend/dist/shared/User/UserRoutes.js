"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserContollers_1 = require("./UserContollers");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const userRouter = (0, express_1.Router)();
userRouter.use((0, AuthMiddleware_1.protect)());
userRouter.get("/profile", UserContollers_1.getProfile);
userRouter.patch("/profile", UserContollers_1.updateProfile);
exports.default = userRouter;
//# sourceMappingURL=UserRoutes.js.map