import express, { Application } from "express";
import http from "http";
import cors from "cors";

import { initializeSocketServer } from "./shared/utils/socket";
import authRouter from "./shared/auth/AuthRoutes";
import customerRouter from "./api/customers/routes";

const app: Application = express();
const server = http.createServer(app);

// Init WebSocket server
initializeSocketServer(server);

app.use(cors());
app.use(express.json());

app.use("/api/customer", customerRouter);
app.use("/auth", authRouter);

export { app, server };
