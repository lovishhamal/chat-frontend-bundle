import { io } from "socket.io-client";

export const socketIo = () =>
  io("https://chat-backed.onrender.com", {
    transports: ["websocket", "polling"],
  });
