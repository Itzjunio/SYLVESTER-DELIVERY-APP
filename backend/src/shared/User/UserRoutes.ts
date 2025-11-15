import { Router } from "express";
import { getProfile, updateProfile } from "./UserContollers";
import { protect } from "../middlewares/AuthMiddleware";

const userRouter = Router();

userRouter.use(protect());

userRouter.get("/profile", getProfile);
userRouter.patch("/profile", updateProfile);

export default userRouter;
