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
  const myVideo = useRef<any>(null);
  const userVideo = useRef<any>(null);
  const connectionRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState<any>(null);

  useEffect(() => {
    if (myVideo.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          myVideo.current.srcObject = currentStream;
        });

      socket.on("callUser", ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }
  }, [myVideo.current]);

  // useEffect(() => {
  //   userRef.current = state.user;

  //   socket
  //     .off("call_user")
  //     .on("call_user", ({ from, name: callerName, signal, data }) => {
  //       if (state.user._id !== data.caller_id) {
  //         myRef?.current.play();
  //         userRef.current = data;
  //         setOpen(true);
  //       }
  //       setCall({ isReceivedCall: true, from, name: callerName, signal });
  //     });
  //   socket.on("call_accepted", (signal) => {
  //     setCallAccepted(true);
  //     console.log("ss", signal);

  //     userVideo.current.srcObject = signal;
  //   });
  // }, []);

  const callUser = (data: any) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signalStream) => {
      socket.emit("call_user", {
        userToCall: data.id,
        signalData: signalStream,
        from: "me",
        name,
        data,
      });
    });

    peer.on("stream", (stream1) => {
      console.log("s1", stream1);

      userVideo.current.srcObject = stream1;
    });

    connectionRef.current = peer;
  };

  const pauseAudio = () => myRef.current.pause();

  const answerCall = () => {
    pauseAudio();
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, to: call.from });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;

    setCallAccepted(true);
  };

  const leaveCall = () => {
    connectionRef.current?.destroy();
  };

  return (
    <VideoContext.Provider value={{ socket, callUser }}>
      {children}

      <div style={{ display: "flex" }}>
        <div style={{ border: "1px solid red" }}>
          <video playsInline muted autoPlay ref={myVideo}></video>
        </div>
        <div style={{ border: "1px solid red" }}>
          <video playsInline muted autoPlay ref={userVideo}></video>
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
