import { io } from "socket.io-client";

export const socketIo = () => {
  const url: any = process.env.REACT_APP_API_URI;

  return io(url, {
    transports: ["websocket", "polling"],
  });
};
