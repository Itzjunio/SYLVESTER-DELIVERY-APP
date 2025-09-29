

import { Router } from "express";
import { protect } from "../../shared/middlewares/AuthMiddleware";
import { getRatings } from "./controllers";


const sharedRouter = Router()

sharedRouter.use(protect());

sharedRouter.get("/restaurants/ratings", getRatings);


export default sharedRouter;