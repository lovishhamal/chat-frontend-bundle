import React, { useEffect } from "react";

const Video1 = React.forwardRef((props, ref: any) => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        ref.current.srcObject = currentStream;
      });
  }, []);

  return (
    <video
      playsInline
      muted
      autoPlay
      ref={ref}
      style={{
        width: 400,
        height: 400,
        position: "absolute",
        right: "10%",
        bottom: "-5%",
      }}
    />
  );
});

export default Video1;
