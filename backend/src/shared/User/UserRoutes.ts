

import { Router } from "express";
import { protect } from "../auth/AuthMiddleware";
import { getProfile, updateProfile } from "./UserContollers";
const userRouter = Router();


userRouter.use(protect);
userRouter.use("/profile", getProfile)
userRouter.use("/update", updateProfile)


