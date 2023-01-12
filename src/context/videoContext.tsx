import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";

export const VideoContext = createContext({});
const socket = socketIo();

const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);

  const userRef = useRef<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    userRef.current = state.user;
    socket.off("get_call").on("get_call", (data: any) => {
      if (state.user._id === data.id) {
        userRef.current = data;
        setOpen(true);
      }
    });
  }, []);

  const callUser = (data: any) => {
    return socket.emit("call_user", data);
  };

  return (
    <VideoContext.Provider value={{ callUser, socket }}>
      {children}
      <CustomModal
        title='Video Call'
        open={open}
        setOpen={setOpen}
        okText='Answer'
        cancelText='Decline'
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar image={userRef.current?.image} />
          {userRef.current?.name} is Calling you
        </div>
      </CustomModal>
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
