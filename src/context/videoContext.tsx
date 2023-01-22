import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Video from "../components/context/video";
import { CloseOutlined } from "@ant-design/icons";

export const VideoContext = createContext({});
const socket = socketIo();

let receiverInfo: any = {};
let connectionId: string = "";
const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const audio = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  );
  const userVideoRef = useRef<any>(null);
  const partnerVideoRef = useRef<any>(null);
  const peerRef = useRef<any>();
  const otherUser = useRef<any>();
  const userStream = useRef<any>();
  const [open, setOpen] = useState<any>(false);

  const [callInitiated, setCallInitiated] = useState<boolean>(false);

  useEffect(() => {
    socket.on(
      "call_user",
      ({ connectionId: connection_id, receiverInfo: receiver_info }) => {
        if (state.user._id === receiver_info.receiver_id) {
          receiverInfo = receiver_info;
          connectionId = connection_id;
          setOpen(true);
        }
      }
    );

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
    partnerVideoRef.current.srcObject = e.streams[0];
  }

  const pauseAudio = () => audio.pause();

  const initiateCall = (stream: any) => {
    userVideoRef.current.srcObject = stream;
    userStream.current = stream;
    socket.emit("join_room", { connectionId, receiverInfo });
  };

  const onPressVideo = (payload: any) => {
    receiverInfo = payload;

    connectionId = payload.connectionId;
    setCallInitiated(true);
  };

  return (
    <VideoContext.Provider value={{ socket, callUser: onPressVideo }}>
      {callInitiated ? (
        <div style={{ position: "relative", backgroundColor: "black" }}>
          <div>
            <Video
              ref={partnerVideoRef}
              style={{ height: "100vh", width: "100vw" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: 50,
              bottom: -100,
            }}
          >
            <Video
              ref={userVideoRef}
              myVideo
              initiateCall={initiateCall}
              style={{ height: 600, width: 300 }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              backgroundColor: "red",
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              peerRef.current.close();
              setCallInitiated(false);
            }}
          >
            <CloseOutlined style={{ color: "#ffffff" }} />
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
        onOkPress={() => {
          setCallInitiated(true);
        }}
        onCancelPress={pauseAudio}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar image={receiverInfo?.image} />
          <h3 style={{ textTransform: "capitalize", marginRight: 5 }}>
            {receiverInfo?.name}
          </h3>
          is Calling you
        </div>
      </CustomModal>
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
