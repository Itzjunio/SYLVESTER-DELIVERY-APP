

import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import { getRatings, orderStatus } from "./controllers";


const sharedRouter = Router()

sharedRouter.use(protect());

sharedRouter.get("/restaurants/ratings", getRatings);
sharedRouter.get("/orders/:orderId/status", orderStatus);


export default sharedRouter;