import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import { vendorDashboard, orderStatus, menuItems, toggleMenuItemAvailability, rejectOrder } from "./controllers";


const venderRouter = Router()

venderRouter.use(protect(['vendor']));
venderRouter.get("/dashboard", vendorDashboard)
venderRouter.post("/menu/items", menuItems)
venderRouter.put("/orders/:orderId/status", orderStatus)
venderRouter.put("/orders/:orderId/reject", rejectOrder)
venderRouter.put("/restuarant/:restaurantId/item/:itemName/avialability", toggleMenuItemAvailability)


export default venderRouter;