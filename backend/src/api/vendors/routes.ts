import { Router } from "express";
import { protect } from "../../shared/auth/AuthMiddleware";
import { vendorDashboard, orderStatus, menuItems  } from "./controllers";


const venderRouter = Router()

venderRouter.use(protect(['vendor']));
venderRouter.get("/dashboard", vendorDashboard)
venderRouter.post("/menu/item", menuItems)
venderRouter.put("/orders/:_id/status", orderStatus)


export default venderRouter;