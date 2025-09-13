import { Router } from "express";
import { protect } from "../../shared/auth/AuthMiddleware";
import { orderAssigned, orderStatus } from "./controllers";


const riderRouter = Router();

riderRouter.use(protect(['rider']))

riderRouter.get("/order/assign/", orderAssigned)
riderRouter.get("/order/status", orderStatus)


export default riderRouter;