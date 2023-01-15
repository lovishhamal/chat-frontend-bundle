import { createContext, useContext, useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";

export const VideoContext = createContext({});
const socket = socketIo();

const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const myRef = useRef<any>(null);
  const userRef = useRef<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    userRef.current = state.user;
    socket.off("get_call").on("get_call", (data: any) => {
      if (state.user._id !== data.caller_id) {
        myRef?.current.play();
        userRef.current = data;
        setOpen(true);
      }
    });
  }, []);

  const callUser = (data: any) => {
    return socket.emit("call_user", data);
  };

  const pauseAudio = () => myRef.current.pause();

  return (
    <VideoContext.Provider value={{ callUser, socket }}>
      {children}
      <CustomModal
        title='Video Call'
        open={open}
        setOpen={setOpen}
        okText='Answer'
        cancelText='Decline'
        onOkPress={pauseAudio}
        onCancelPress={pauseAudio}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar image={userRef.current?.image} />
          <h3 style={{ textTransform: "capitalize", marginRight: 5 }}>
            {userRef.current?.name}
          </h3>
          is Calling you
        </div>
      </CustomModal>
      <audio
        ref={myRef}
        src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      />
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
