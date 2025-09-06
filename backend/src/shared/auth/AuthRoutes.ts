import { Router } from "express";
import { register, login, logout, refreshToken, verifyUserToken, resetPassword, forgotPassword } from "./AuthController.js";
import { registerDeviceToken } from "../notifications/fcmControllers.js";
import { protect } from "./AuthMiddleware.js";
import { forgotPasswordLimiter } from "../utils/rate-limiter.js";
const authRouter = Router();


authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.put("/refresh-token", refreshToken);

authRouter.use(protect);
authRouter.use("/auth/forgot-password", forgotPasswordLimiter)

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/register-devicetoken", registerDeviceToken);
authRouter.get("/verify", verifyUserToken);
authRouter.delete("/logout", logout);


export default authRouter;