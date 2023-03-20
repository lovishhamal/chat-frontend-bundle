import React, { useEffect, useState } from "react";

// remove this in production c=0 and related code

const Video = React.forwardRef((props: any, ref: any) => {
  let c = 0;
  useEffect(() => {
    if (props.myVideo && !c) {
      c++;
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
