import { register, login, logout, refreshToken, verifyUserToken, resetPassword, forgotPassword } from "./AuthController";
import { registerDeviceToken } from "../notifications/fcmControllers";
import { forgotPasswordLimiter } from "../utils/utils";
import { protect } from "./AuthMiddleware";
import { Router } from "express";


const authRouter = Router();


authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);

authRouter.use(protect);
authRouter.use("/auth/forgot-password", forgotPasswordLimiter)

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/register-devicetoken", registerDeviceToken);
authRouter.get("/verify", verifyUserToken);
authRouter.delete("/logout", logout);


export default authRouter;