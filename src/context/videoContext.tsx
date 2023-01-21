import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Video from "../components/context/video";
import { CloseOutlined } from "@ant-design/icons";
import { PeerContext } from "./peerContext";
import { message } from "antd";

export const VideoContext = createContext({});
const socket = socketIo();

let stream = {};
const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const { peer, setRemoteAnswer, sendStream, createAnswer, createOffer } =
    useContext<any>(PeerContext);
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
    // socket.off("incoming_call").on("incoming_call", async ({ offer, data }) => {
    //   setId(data.caller_id);
    //   if (state.user._id !== data.caller_id) {
    //     audio.play();
    //     answerRef.current = offer;
    //     setOpen(true);
    //   }
    // });
    // socket.off("call-accepted").on("call_accepted", async (answer) => {
    //   setCallAccepted(true);
    //   await setRemoteAnswer(answer);
    // });

    socket.on("offer", async (payload) => {
      try {
        const desc = new RTCSessionDescription(payload.sdp);
        await setRemoteAnswer(desc);
        console.log("exe 1");

        await sendStream(myVideoRef.current.srcObject);
        console.log("exe 2");
        await createAnswer();
        console.log("peer.localDescription in offer", peer.localDescription);
        const data = {
          sdp: peer.localDescription,
        };
        socket.emit("answer", data);
      } catch (error) {
        console.log("er", error);
      }
    });

    socket.on("ice-candidate", (incoming) => {
      const candidate = new RTCIceCandidate(incoming);
      peer.addIceCandidate(candidate);
    });

    socket.on("answer", (message: any) => {
      const desc = new RTCSessionDescription(message.sdp);
      peer.setRemoteDescription(desc);
    });

    peer.onicecanndiate = handleIceCandidate;

    peer.addEventListener("negotiationneeded", async () => {
      await createOffer();
      socket.emit("offer", {
        data: {
          receiver_id: "63c020049f6f00b3a3d30260",
          caller_id: "63c01f8b9f6f00b3a3d3025f",
          name: "lovish hamal",
          image: "",
        },
        sdp: peer.localDescription,
      });
    });

    peer.addEventListener("track", (track: any) => {
      userVideoRef.current.srcObject = track.streams[0];
      setCallAccepted(true);
    });

    return () => {
      peer.removeEventListener("track", () => {});
      peer.removeEventListener("negotiationneeded", () => {});
    };
  }, []);

  const handleIceCandidate = (e: any) => {
    if (e.candidate) {
      const p = { candidate: e.candidate };
      socket.emit("ice-candidate", p);
    }
  };

  const callUser = async (data: any) => {
    setCallInitiated(true);

    if (myVideoRef.current) {
      sendStream(myVideoRef.current.srcObject);
    }
    // socket.emit("call_user", {
    //   offer,
    //   data,
    // });
  };

  const answerCall = async () => {
    pauseAudio();
    setCallInitiated(true);
    setCallAccepted(true);

    // const answer = await createAnswer(answerRef.current);
    // // socket.emit("answer_call", { answer });
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
          <Video ref={myVideoRef} myVideo callUser={callUser} />
          <Video ref={userVideoRef} />
          {/* <Video ref={userVideoRef} /> */}
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
