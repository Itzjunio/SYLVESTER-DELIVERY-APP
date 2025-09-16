import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import 
    {
        markStatus,
        riderDashBoard,
        viewOrderDetails,
        acceptOrderAssignment
    } from "./controllers";


const riderRouter = Router();

riderRouter.use(protect(['rider']))

riderRouter.get("/me", riderDashBoard)
riderRouter.get("/order/:orderId", viewOrderDetails)
riderRouter.put("/order/:orderId/accept/assign", acceptOrderAssignment)
riderRouter.put("/order/status", markStatus)


export default riderRouter;