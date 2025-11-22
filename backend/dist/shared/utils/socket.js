"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketServerInstance = exports.initializeSocketServer = void 0;
const socket_io_1 = require("socket.io");
let io;
const initializeSocketServer = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`New WebSocket client connected: ${socket.id}`);
        socket.on("rider:locationUpdate", (data) => {
            console.log(`Rider ${data.riderId} moved to [${data.lat}, ${data.lng}]`);
            io.to(`rider_${data.riderId}`).emit("rider:locationUpdate", data);
            io.to("admin_tracking").emit("rider:locationUpdate", data);
        });
        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });
        socket.on("leaveRoom", (room) => {
            socket.leave(room);
            console.log(`Socket ${socket.id} left room ${room}`);
        });
        socket.on("disconnect", () => {
            console.log(`WebSocket client disconnected: ${socket.id}`);
        });
    });
};
exports.initializeSocketServer = initializeSocketServer;
const getSocketServerInstance = () => {
    if (!io)
        throw new Error("Socket.IO server not initialized.");
    return io;
};
exports.getSocketServerInstance = getSocketServerInstance;
//# sourceMappingURL=socket.js.map