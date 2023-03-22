import React, { useEffect, useState } from "react";

// remove this in production c=0 and related code

const Video = React.forwardRef(
  ({ myVideo, initiateCall, muted = true, style }: any, ref: any) => {
    let c = 0;
    useEffect(() => {
      if (myVideo && !c) {
        c++;
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            initiateCall(currentStream);
          });
      }
    }, []);

    return <video playsInline muted={muted} autoPlay ref={ref} style={style} />;
  }
);

export default Video;
