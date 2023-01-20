import { createContext, useState } from "react";

export const PeerContext = createContext({});

const PeerContextProvider = ({ children }: { children: any }) => {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478",
        ],
      },
    ],
  });

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: any) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer: any) => {
    await peer.setRemoteDescription(answer);
  };

  const sendStream = async (stream: any) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  return (
    <PeerContext.Provider
      value={{
        peer,
        createAnswer,
        createOffer,
        setRemoteAnswer,
        sendStream,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export default PeerContextProvider;
