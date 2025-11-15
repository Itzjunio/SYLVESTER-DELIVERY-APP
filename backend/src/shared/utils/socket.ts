import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initializeSocketServer = (server: HttpServer): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`New WebSocket client connected: ${socket.id}`);
    socket.on(
      "rider:locationUpdate",
      (data: { riderId: string; lat: number; lng: number }) => {
        console.log(
          `Rider ${data.riderId} moved to [${data.lat}, ${data.lng}]`
        );

        io.to(`rider_${data.riderId}`).emit("rider:locationUpdate", data);
        io.to("admin_tracking").emit("rider:locationUpdate", data);
      }
    );

    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("leaveRoom", (room: string) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`WebSocket client disconnected: ${socket.id}`);
    });
  });
};

export const getSocketServerInstance = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO server not initialized.");
  return io;
};
