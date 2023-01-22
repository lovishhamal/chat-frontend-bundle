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

let receiverInfo: any = {};
let connectionId: string = "";
const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const audio = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  );
  const userVideo = useRef<any>(null);
  const partnerVideo = useRef<any>(null);
  const peerRef = useRef<any>();
  const otherUser = useRef<any>();
  const userStream = useRef<any>();
  const [open, setOpen] = useState<any>(false);

  const [callInitiated, setCallInitiated] = useState<boolean>(false);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);

  useEffect(() => {
    socket.on("call_user", (userId: any, connection_id) => {
      console.log("connection_id", connection_id);

      if (state.user._id === userId) {
        connectionId = connection_id;
        setOpen(true);
      }
    });

    socket.on("other_user", (userID: any) => {
      callUser(userID);
      otherUser.current = userID;
    });

    socket.on("user_joined", (userID: any) => {
      otherUser.current = userID;
    });

    socket.on("offer", handleRecieveCall);

    socket.on("answer", handleAnswer);

    socket.on("ice_candidate", handleNewICECandidateMsg);
  }, []);

  const createPeer = (userID?: any) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  };

  const callUser = (userID: any) => {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track: any) =>
        peerRef.current.addTrack(track, userStream.current)
      );
  };

  const handleNegotiationNeededEvent = (userID: any) => {
    peerRef.current
      .createOffer()
      .then((offer: any) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("offer", payload);
      })
      .catch((e: any) => console.log(e));
  };

  const handleRecieveCall = (incoming: any) => {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track: any) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer: any) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("answer", payload);
      });
  };

  const handleAnswer = (message: any) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .catch((e: any) => console.log(e));
  };

  const handleICECandidateEvent = (e: any) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socket.emit("ice_candidate", payload);
    }
  };

  const handleNewICECandidateMsg = (incoming: any) => {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log(e));
  };

  function handleTrackEvent(e: any) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  const pauseAudio = () => audio.pause();

  const initiateCall = (stream: any) => {
    userVideo.current.srcObject = stream;
    userStream.current = stream;
    socket.emit("join_room", connectionId, receiverInfo.receiver_id);
  };

  const onPressVideo = (payload: any) => {
    console.log(" payload.connectionId", payload.connectionId);

    receiverInfo = payload;
    connectionId = payload.connectionId;
    setCallInitiated(true);
  };

  return (
    <VideoContext.Provider value={{ socket, callUser: onPressVideo }}>
      {callInitiated && (
        <Video ref={userVideo} myVideo initiateCall={initiateCall}></Video>
      )}
      <Video ref={partnerVideo}></Video>
      {children}
      <CustomModal
        title='Video Call'
        open={open}
        setOpen={setOpen}
        okText='Answer'
        cancelText='Decline'
        onOkPress={() => {
          setCallInitiated(true);
        }}
        onCancelPress={pauseAudio}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <Avatar image={userRef.current?.image} />
          <h3 style={{ textTransform: "capitalize", marginRight: 5 }}>
            {userRef.current?.name}
          </h3> */}
          is Calling you
        </div>
      </CustomModal>
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
