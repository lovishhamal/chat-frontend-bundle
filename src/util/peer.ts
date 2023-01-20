class Peer {
  peer: any = {};
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  createOffer = async () => {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  };

  createAnswer = async (offer: any) => {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  };

  setRemoteAnswer = async (answer: any) => {
    await this.peer.setRemoteDescription(answer);
  };

  sendStream = async (stream: any) => {
    const tracks = stream.getTracks();

    for (const track of tracks) {
      this.peer.addTrack(track, stream);
    }
  };
}

export default Peer;
