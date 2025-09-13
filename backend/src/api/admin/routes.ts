import { Router } from "express"
import { protect } from "../../shared/auth/AuthMiddleware";
import authRouter from "../../shared/auth/AuthRoutes";

import { adminDashBoard, users, orders, orderStatus } from "./controllers";
const adminRouter = Router();

authRouter.use(protect(['admin']));

authRouter.get("/dashboard", adminDashBoard)
authRouter.get("/users", users)
authRouter.get("/orders", orders)
authRouter.get("/orders/:id/status", orderStatus)


export default adminRouter;