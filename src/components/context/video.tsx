import React, { useEffect, useState } from "react";

const Video = React.forwardRef((props: any, ref: any) => {
  useEffect(() => {
    if (props.myVideo) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          props.initiateCall(currentStream);
        });
    }
  }, []);

  return <video playsInline muted autoPlay ref={ref} style={props.style} />;
});

export default Video;
