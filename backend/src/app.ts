import express, { Application } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import errorHandler from "./shared/middlewares/errorHandlerMiddleware";
import { initializeSocketServer } from "./shared/utils/socket";
import authRouter from "./shared/auth/AuthRoutes";
import customerRouter from "./api/customers/routes";
import venderRouter from "./api/vendors/routes";
import riderRouter from "./api/riders/routes";
import adminRouter from "./api/admin/routes";
import userRouter from "./shared/User/UserRoutes";

const app: Application = express();
const server = http.createServer(app);


app.use(cookieParser());
app.use(helmet())
initializeSocketServer(server);

app.use(cors());

// {
//     origin: 'http://localhost:3000',
//     credentials: true,
//     optionsSuccessStatus: 200 
//   }
app.use(express.json());

app.use("/auth", authRouter);
app.use('/api/user', userRouter);
app.use("/api/vendor", venderRouter);
app.use("/api/customer", customerRouter);
app.use("/api/rider", riderRouter);
app.use("/admin", adminRouter);

app.use(errorHandler)

export { server };
