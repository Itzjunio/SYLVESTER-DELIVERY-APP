import { Router } from "express"
import { protect } from "../../shared/middlewares/AuthMiddleware";
import 
    {
    adminDashBoard,
    users, orders,
    orderStatus,
    getRiderPerformanceReport,
    deactivateUser
 } from "./controllers";


const adminRouter = Router();

adminRouter.use(protect(['admin']));

adminRouter.get("/dashboard", adminDashBoard)
adminRouter.get("/users", users)
adminRouter.get("/orders", orders)
adminRouter.get("/orders/:orderId/status", orderStatus)
adminRouter.get("/rider/performance", getRiderPerformanceReport)
adminRouter.put("/user/:userId/deactivate", deactivateUser)

export default adminRouter;