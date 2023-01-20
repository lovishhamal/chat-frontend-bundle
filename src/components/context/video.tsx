import React, { useEffect, useState } from "react";
import Peer from "../../util/peer";

const Video = React.forwardRef((props: any, ref: any) => {
  useEffect(() => {
    if (props.myVideo) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          ref.current.srcObject = currentStream;
          props.sendStream(currentStream);
        });
    }
  }, []);

  return (
    <>
      <video
        playsInline
        muted
        autoPlay
        ref={ref}
        style={{ alignSelf: "center", justifySelf: "center" }}
      />
    </>
  );
});

export default Video;
