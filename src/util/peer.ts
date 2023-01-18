import Peer from "simple-peer";

export const simplePeer = ({
  initiator = false,
  trickle = false,
  ref,
}: any): any => {
  return new Peer({
    initiator: initiator,
    trickle: trickle,
    stream: ref.current,
  });
};
