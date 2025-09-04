import { Router } from "express";

import { register, login, logout, refreshToken } from "./AuthController.js";
const authRouter = Router();


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh-token", refreshToken)
authRouter.post("/logout", logout)


export default authRouter;