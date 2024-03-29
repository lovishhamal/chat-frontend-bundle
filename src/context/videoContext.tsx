import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Avatar, CustomModal } from "../common";
import { socketIo } from "../util/socket";
import { AuthContext } from "./authContext";
import Video from "../components/context/video";
import {
  CloseOutlined,
  VideoCameraOutlined,
  PlaySquareOutlined,
  DownCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { CallerInfo } from "../interface/components/chat/chatInterface";

export const VideoContext = createContext({});
const socket = socketIo();
let connectionId: string = "";

let videoPaused = false;
const VideoContextProvider = ({ children }: { children: any }) => {
  const { state } = useContext<any>(AuthContext);
  const audio = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  );

  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<any>([]);
  const modalRef = useRef<any>(null);
  const userVideoRef = useRef<any>(null);
  const partnerVideoRef = useRef<any>(null);
  const peerRef = useRef<any>();
  const otherUser = useRef<any>();
  const [callInitiated, setCallInitiated] = useState<boolean>(false);
  const [receiverInfo, setReceiverInfo] = useState<CallerInfo>({});
  const [remoteTrackMuted, setRemoteTrackMuted] = useState<boolean>(false);
  const [remoteVideo, setRemoteVideo] = useState(null);
  const [userVideoInitialized, setUserVideoInitialized] = useState(null);
  const [userVideoPaused, setUserVideoPaused] = useState(false);
  const [stream, setStream] = useState<any>({});

  useEffect(() => {
    socket.on(
      "call_user",
      ({ connectionId: connection_id, receiverInfo: receiver_info }) => {
        if (state.user._id === receiver_info.receiver_id) {
          console.log("receiver_info.receiver_id -> ", receiver_info);
          setReceiverInfo(receiver_info);
          connectionId = connection_id;
          modalRef.current.openModal();
        }
      }
    );

    socket.on("other_user", (userId: any) => {
      callUser(userId);
      otherUser.current = userId;
    });

    socket.on("user_joined", (userId: any) => {
      otherUser.current = userId;
    });

    socket.on("offer", handleRecieveCall);

    socket.on("answer", handleAnswer);

    socket.on("ice_candidate", handleNewICECandidateMsg);

    socket.on("call_ended", (payload) => {
      setCallInitiated(false);
      partnerVideoRef.current = null;
    });

    socket.on("video_paused", (data: any) => {});
  }, []);

  useEffect(() => {
    if (remoteVideo) {
      partnerVideoRef.current.srcObject = remoteVideo;
    }
  }, [remoteVideo]);

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
    setCallInitiated(true);
    peerRef.current = createPeer(userID);
    userVideoRef.current.srcObject
      .getTracks()
      .forEach((track: any) =>
        peerRef.current.addTrack(track, userVideoRef.current.srcObject)
      );
  };

  const handleNegotiationNeededEvent = (userId: any) => {
    peerRef.current
      .createOffer()
      .then((offer: any) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          receiver: userId,
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
        userVideoRef.current.srcObject.getTracks().forEach((track: any) => {
          peerRef.current.addTrack(track, userVideoRef.current.srcObject);
        });
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer: any) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          receiver: incoming.caller,
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
        receiver: otherUser.current,
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
    e.track.addEventListener("mute", () => {
      setRemoteVideo(null);
      setRemoteTrackMuted(true);
      socket.emit("video_paused", { userId: state.user._id });
    });

    e.track.addEventListener("unmute", () => {
      setRemoteVideo(e.streams[0]);
      setRemoteTrackMuted(false);
    });
  }

  const pauseAudio = () => {
    endCall();
    audio.pause();
  };

  const initiateCall = (stream: any) => {
    userVideoRef.current.srcObject = stream;
    socket.emit("join_room", { connectionId, receiverInfo });
  };

  const onPressVideo = (payload: any) => {
    setReceiverInfo(payload);
    connectionId = payload.connectionId;
    setCallInitiated(true);
  };

  const onClickVideo = () => {
    videoPaused = !videoPaused;
    if (videoPaused) {
      setUserVideoPaused(true);
      const senders = peerRef.current.getSenders();
      userVideoRef.current.srcObject.getTracks().forEach((track: any) => {
        track.enabled = false;
        track.stop();
        var sender = senders.find(function (s: any) {
          return s.track.kind == track.kind;
        });
        sender.replaceTrack(track);
      });
    } else {
      resumeVdo();
    }
    // userVideoRef.current.srcObject.removeTrack(prevTracks[0]);
    // peerRef.current.removeTrack(prevTracks[0]);
  };

  const resumeVdo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        let videoTrack = stream.getVideoTracks()[0];
        const senders = peerRef.current.getSenders();
        var sender = senders.find(function (s: any) {
          return s.track.kind == videoTrack.kind;
        });
        sender.replaceTrack(videoTrack);
        // videoTrack.onended = function () {
        //   sender.replaceTrack(stream.getTracks()[1]);
        // };
        setUserVideoPaused(false);
      });
  };

  const screenShare = () => {
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      let videoTrack = stream.getVideoTracks()[0];
      const senders = peerRef.current.getSenders();
      var sender = senders.find(function (s: any) {
        return s.track.kind == videoTrack.kind;
      });
      sender.replaceTrack(videoTrack);
      // videoTrack.onended = function () {
      //   sender.replaceTrack(stream.getTracks()[1]);
      // };
      setStream(stream);
    });
  };

  const endCall = () => {
    socket.emit("call_ended", { connectionId });
  };

  useEffect(() => {
    if (userVideoInitialized) {
      initiateCall(userVideoInitialized);
    }
  }, [userVideoInitialized]);

  const onClickRecording = async () => {
    try {
      const options = { mimeType: "video/webm; codecs=vp9" };

      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "screen-record.webm";
        a.click();

        chunksRef.current = [];
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setStream(null);
  };

  return (
    <VideoContext.Provider value={{ socket, callUser: onPressVideo }}>
      {callInitiated ? (
        <div style={{ position: "relative", backgroundColor: "black" }}>
          <div>
            {remoteTrackMuted ? (
              <div
                style={{
                  height: "100vh",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={receiverInfo.image} />
              </div>
            ) : (
              <Video
                ref={partnerVideoRef}
                style={{ height: "100vh", width: "100vw" }}
                muted={false}
              />
            )}
          </div>
          <div
            style={{
              position: "absolute",
              right: 50,
              bottom: userVideoPaused ? 50 : -100,
            }}
          >
            {userVideoPaused ? (
              <img
                src={state.user?.image?.data}
                style={{
                  height: 230,
                  width: 370,
                  objectFit: "contain",
                }}
              />
            ) : (
              <Video
                ref={userVideoRef}
                myVideo
                initiateCall={(stream: any) => setUserVideoInitialized(stream)}
                style={{ height: 600, width: 300 }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              bottom: 10,
              left: "50%",
            }}
          >
            <div
              style={{
                backgroundColor: "red",
                borderRadius: 100,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                userVideoRef.current.srcObject
                  .getTracks()
                  .forEach((track: any) => {
                    track.enabled = false;
                    track.stop();
                  });
                peerRef?.current?.close();
                setCallInitiated(false);
                endCall();
              }}
            >
              <CloseOutlined style={{ color: "#ffffff" }} />
            </div>
            <span style={{ margin: "0px 2px 0px 2px" }} />
            <div
              onClick={() => onClickVideo()}
              style={{
                backgroundColor: "red",
                borderRadius: 100,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <VideoCameraOutlined style={{ color: "#ffffff" }} />
            </div>
            <div
              onClick={screenShare}
              style={{
                backgroundColor: "red",
                borderRadius: 100,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <PlaySquareOutlined style={{ color: "#ffffff" }} />
            </div>
            <div
              style={{
                backgroundColor: "red",
                borderRadius: 100,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <DownCircleOutlined
                style={{ color: "#ffffff" }}
                onClick={onClickRecording}
              />
            </div>
            <div
              onClick={stopRecording}
              style={{
                backgroundColor: "red",
                borderRadius: 100,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <StopOutlined style={{ color: "#ffffff" }} />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
      <CustomModal
        ref={modalRef}
        title="Video Call"
        okText="Answer"
        cancelText="Decline"
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
