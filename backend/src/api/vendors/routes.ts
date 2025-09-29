import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import {
  vendorDashboard,
  orderStatus,
  addItems,
  toggleMenuItemAvailability,
  rejectOrder,
  updateItem,
  getItem,
  deleteItem,
  toggleRestaurantAvailability
} from "./controllers";

const venderRouter = Router();

venderRouter.use(protect(["vendor"]));
venderRouter.get("/dashboard", vendorDashboard);
venderRouter.get("/menu/items/itemId", getItem);
venderRouter.post("/menu/items", addItems);
venderRouter.patch("/menu/items/:itemId", updateItem);
venderRouter.delete("/menu/items/:itemId", deleteItem);
venderRouter.delete("/orders/:orderId/status", orderStatus);
venderRouter.put("/orders/:orderId/actions/reject", rejectOrder);
venderRouter.patch(
  "/menu/items/:itemId/availability",
  toggleMenuItemAvailability
);
venderRouter.patch("/availability", toggleRestaurantAvailability);

export default venderRouter;
