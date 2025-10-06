import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import {
  markStatus,
  riderDashBoard,
  viewOrderDetails,
  acceptOrderAssignment,
} from "./controllers";

const riderRouter = Router();

riderRouter.use(protect(["rider"]));

riderRouter.get("/me", riderDashBoard);
riderRouter.get("/orders/:orderId", viewOrderDetails);
riderRouter.put("/orders/:orderId/assign", acceptOrderAssignment);
riderRouter.patch("/orders/:orderId/status", markStatus);

export default riderRouter;
