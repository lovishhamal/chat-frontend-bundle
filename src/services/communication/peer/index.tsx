import { useRef, useEffect } from "react";
import { socketIo } from "../../../util/socket";

const socket = socketIo();

const Peer = () => {
  const userVideo = useRef<any>(null);
  const partnerVideo = useRef<any>(null);
  const peerRef = useRef<any>();
  const otherUser = useRef<any>();
  const userStream = useRef<any>();

  useEffect(() => {
    if (userVideo.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream: any) => {
          userVideo.current.srcObject = stream;
          userStream.current = stream;

          socket.emit("join room", 123);

          socket.on("other user", (userID: any) => {
            console.log("other", otherUser);

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
    console.log("negotiation needed");

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

  return (
    <>
      <video ref={userVideo} autoPlay></video>
      <video ref={partnerVideo} autoPlay></video>
    </>
  );
};

export default Peer;
