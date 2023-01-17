import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Peer from "simple-peer";

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
  const [stream, setStream] = useState<any>(null);
  const [name, setName] = useState<any>(null);

  useEffect(() => {
    if (myVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          myVideoRef.current.srcObject = currentStream;
        });
    }
  }, [myVideoRef.current]);

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

  const answerCall = () => {
    pauseAudio();
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signalData) => {
      socket.emit("answer_call", { signalData });
    });

    peer.on("stream", (currentStream) => {
      userVideoRef.current.srcObject = currentStream;
    });

    peer.signal(signalRef.current);
    connectionRef.current = peer;
  };

  const callUser = (data: any) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

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
    });

    connectionRef.current = peer;
  };

  const pauseAudio = () => myRef.current.pause();

  return (
    <VideoContext.Provider value={{ socket, callUser }}>
      {children}

      <div style={{ display: "flex" }}>
        <div style={{ border: "1px solid red" }}>
          <video playsInline muted autoPlay ref={myVideoRef}></video>
        </div>
        <div style={{ border: "1px solid red" }}>
          <video playsInline muted autoPlay ref={userVideoRef}></video>
        </div>
      </div>

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
