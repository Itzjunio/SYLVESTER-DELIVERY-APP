import {
  register,
  login,
  logout,
  refreshToken,
  verifyUserAccount,
  resetPassword,
  forgotPassword,
  resendVerificationCode,
} from "./AuthController";
import { registerDeviceToken } from "../notifications/fcmControllers";
import { forgotPasswordLimiter } from "../utils/utils";
import { protect } from "../middlewares/AuthMiddleware";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verification/resend", resendVerificationCode);
authRouter.post("/auth/verification", verifyUserAccount);

authRouter.use(protect());

authRouter.post("/refresh-token", refreshToken);
authRouter.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
authRouter.put("/reset-password", resetPassword);
authRouter.put("/device-token", registerDeviceToken);
authRouter.delete("/logout", logout);

export default authRouter;
