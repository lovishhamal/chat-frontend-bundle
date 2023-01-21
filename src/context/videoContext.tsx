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
  const audio = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  );
  const userVideo = useRef<any>(null);
  const partnerVideo = useRef<any>(null);
  const peerRef = useRef<any>();
  const otherUser = useRef<any>();
  const userStream = useRef<any>();

  const [callInitiated, setCallInitiated] = useState<boolean>(false);

  useEffect(() => {
    if (userVideo.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream: any) => {
          userVideo.current.srcObject = stream;
          userStream.current = stream;

          socket.emit("join room", 123);

          socket.on("other user", (userID: any) => {
            callUser(userID);
            otherUser.current = userID;
          });

          socket.on("user joined", (userID: any) => {
            otherUser.current = userID;
          });

          socket.on("offer", handleRecieveCall);

          socket.on("answer", handleAnswer);

          socket.on("ice-candidate", handleNewICECandidateMsg);
        });
    }
  }, [userVideo.current]);

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
    console.log("offer event");

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
    console.log("answer event");

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
      socket.emit("ice-candidate", payload);
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

  return (
    <VideoContext.Provider value={{ socket, callUser }}>
      <video ref={userVideo} autoPlay muted></video>
      <video ref={partnerVideo} autoPlay muted></video>

      {/* <CustomModal
        title='Video Call'
        open={open}
        setOpen={setOpen}
        okText='Answer'
        cancelText='Decline'
        onOkPress={() => {}}
        onCancelPress={pauseAudio}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar image={userRef.current?.image} />
          <h3 style={{ textTransform: "capitalize", marginRight: 5 }}>
            {userRef.current?.name}
          </h3>
          is Calling you
        </div>
      </CustomModal> */}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
