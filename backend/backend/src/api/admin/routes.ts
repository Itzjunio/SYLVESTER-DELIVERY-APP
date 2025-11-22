import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import {
  adminStats,
  users,
  orders,
  getRiderPerformanceReport,
  getAllRidersPerformanceReport,
  deactivateUser,
  resolveDispute,
  disputes,
  notify,
  commission,
  assignRider,
} from "./controllers";

const adminRouter = Router();

adminRouter.use(protect(["admin"]));

adminRouter.get("/stats", adminStats);
adminRouter.get("/users", users);
adminRouter.get("/orders", orders);
adminRouter.get("/rider/performances", getRiderPerformanceReport);
adminRouter.get("/riders/performances", getAllRidersPerformanceReport);
adminRouter.get("/disputes", disputes);

adminRouter.post("/notifications", notify);

adminRouter.patch("/users/:userId/deactivate", deactivateUser);
adminRouter.patch("/orders/:id/assign-rider", assignRider);
adminRouter.patch("/commission/:restaurantId", commission);
adminRouter.patch("/disputes/:id/resolve", resolveDispute);


export default adminRouter;
