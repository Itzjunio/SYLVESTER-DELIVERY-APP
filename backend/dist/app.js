"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandlerMiddleware_1 = __importDefault(require("./shared/middlewares/errorHandlerMiddleware"));
const socket_1 = require("./shared/utils/socket");
const AuthRoutes_1 = __importDefault(require("./shared/auth/AuthRoutes"));
const routes_1 = __importDefault(require("./api/customers/routes"));
const routes_2 = __importDefault(require("./api/vendors/routes"));
const routes_3 = __importDefault(require("./api/riders/routes"));
const routes_4 = __importDefault(require("./api/admin/routes"));
const UserRoutes_1 = __importDefault(require("./shared/User/UserRoutes"));
const routes_5 = __importDefault(require("./api/shared/routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.server = server;
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
(0, socket_1.initializeSocketServer)(server);
app.use((0, cors_1.default)());
// {
//     origin: 'http://localhost:3000',
//     credentials: true,
//     optionsSuccessStatus: 200
//   }
app.use(express_1.default.json());
app.use("/auth", AuthRoutes_1.default);
app.use("/api/user", UserRoutes_1.default);
app.use("/api/vendor", routes_2.default);
app.use("/api/customer", routes_1.default);
app.use("/api/rider", routes_3.default);
app.use("/admin", routes_4.default);
app.use(routes_5.default);
app.use(errorHandlerMiddleware_1.default);
//# sourceMappingURL=app.js.map