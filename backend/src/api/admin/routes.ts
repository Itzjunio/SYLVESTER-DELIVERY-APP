import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import {
  adminStats,
  users,
  orders,
  orderStatus,
  getRiderPerformanceReport,
  getAllRidersPerformanceReport,
  deactivateUser,
} from "./controllers";

const adminRouter = Router();

adminRouter.use(protect(["admin"]));

adminRouter.get("/stats", adminStats);
adminRouter.get("/users", users);
adminRouter.get("/orders", orders);
adminRouter.get("/orders/:orderId/status", orderStatus);
adminRouter.get("/rider/performances", getRiderPerformanceReport);
adminRouter.get("/riders/performances", getAllRidersPerformanceReport);

adminRouter.put("/users/:userId/deactivate", deactivateUser);

export default adminRouter;
