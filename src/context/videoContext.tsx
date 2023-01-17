import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Peer from "simple-peer";
import Video from "../components/context/video";

export const VideoContext = createContext({});
const socket = socketIo();

const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const myRef = useRef<any>(null);
  const userRef = useRef<any>(null);
  const myVideoRef = useRef<any>(null);
  const signalRef = useRef<any>(null);
  const userVideoRef = useRef<any>(null);
  const connectionRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callInitiated, setCallInitiated] = useState<boolean>(false);

  useEffect(() => {
    userRef.current = state.user;
    socket.off("call_user").on("call_user", ({ signal, data }) => {
      signalRef.current = signal;
      if (state.user._id !== data.caller_id) {
        myRef?.current.play();
        userRef.current = data;
        setOpen(true);
      }
    });
  }, []);

  const callUser = (data: any) => {
    setCallInitiated(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myVideoRef.current,
    });
    peer.on("signal", (signalData) => {
      socket.emit("call_user", {
        signalData,
        data,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideoRef.current.srcObject = currentStream;
    });

    socket.on("call_accepted", (signalData) => {
      peer.signal(signalData);
      setCallAccepted(true);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    pauseAudio();
    setCallInitiated(true);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myVideoRef.current,
    });

    peer.on("signal", (signalData) => {
      socket.emit("answer_call", { signalData });
    });

    peer.on("stream", (currentStream) => {
      userVideoRef.current.srcObject = currentStream;
    });

    peer.signal(signalRef.current);
    connectionRef.current = peer;
  };

  const pauseAudio = () => myRef.current.pause();

  return (
    <VideoContext.Provider value={{ socket, callUser }}>
      {callInitiated ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "black",
          }}
        >
          <Video ref={myVideoRef} />
          {callAccepted && <Video ref={userVideoRef} />}
        </div>
      ) : (
        children
      )}

      <CustomModal
        title='Video Call'
        open={open}
        setOpen={setOpen}
        okText='Answer'
        cancelText='Decline'
        onOkPress={answerCall}
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
