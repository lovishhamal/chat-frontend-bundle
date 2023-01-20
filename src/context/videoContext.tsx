import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Video from "../components/context/video";
import { CloseOutlined } from "@ant-design/icons";
import { PeerContext } from "./peerContext";

export const VideoContext = createContext({});
const socket = socketIo();

let stream = {};
const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const {
    peer,

    setRemoteAnswer,
    sendStream,
    createAnswer,
    createOffer,
  } = useContext<any>(PeerContext);
  const audio = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  );

  const userRef = useRef<any>(null);
  const myVideoRef = useRef<any>(null);
  const answerRef = useRef<any>(null);
  const userVideoRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callInitiated, setCallInitiated] = useState<boolean>(false);
  const [remoteId, setId] = useState<any>("");

  useEffect(() => {
    socket.off("incoming_call").on("incoming_call", async ({ offer, data }) => {
      setId(data.caller_id);
      if (state.user._id !== data.caller_id) {
        audio.play();
        answerRef.current = offer;
        setOpen(true);
      }
    });
    socket.off("call-accepted").on("call_accepted", async (answer) => {
      setCallAccepted(true);
      await setRemoteAnswer(answer);
    });

    peer.addEventListener("negotiationneeded", async () => {
      const offer = await createOffer();

      socket.emit("call-user", {
        offer: offer,
        data: {
          receiver_id: "63c020049f6f00b3a3d30260",
          caller_id: "63c01f8b9f6f00b3a3d3025f",
          name: "lovish hamal",
          image: "",
        },
      });
    });

    peer.addEventListener("track", (track: any) => {
      console.log("track connected");

      // userVideoRef.current.srcObject = track.streams[0];
    });

    return () => {
      peer.removeEventListener("track", () => {});
      peer.removeEventListener("negotiationneeded", () => {});
    };
  }, []);

  const callUser = async (data: any) => {
    setCallInitiated(true);

    const offer = await createOffer();
    socket.emit("call_user", {
      offer,
      data,
    });
  };

  const answerCall = async () => {
    pauseAudio();
    setCallInitiated(true);
    setCallAccepted(true);

    const answer = await createAnswer(answerRef.current);
    socket.emit("answer_call", { answer });
  };

  const pauseAudio = () => audio.pause();

  return (
    <VideoContext.Provider value={{ socket, callUser }}>
      {callInitiated ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "black",
            height: "100vh",
          }}
        >
          <Video ref={myVideoRef} myVideo sendStream={sendStream} />
          {callAccepted && <Video ref={userVideoRef} />}
          <div style={{ position: "absolute", bottom: 10 }}>
            <CloseOutlined
              onClick={() => {
                myVideoRef.current.srcObject = null;
                setCallInitiated(false);
              }}
              style={{
                color: "red",
                backgroundColor: "white",
                padding: 20,
                borderRadius: "50%",
              }}
            />
          </div>
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
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
