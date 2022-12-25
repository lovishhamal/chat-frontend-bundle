import { io } from "socket.io-client";

export const socketIo = () =>
  io("http://localhost:5000", {
    transports: ["websocket", "polling"],
  });
