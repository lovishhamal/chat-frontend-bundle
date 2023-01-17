import React, { useEffect } from "react";

const Video = React.forwardRef((props, ref: any) => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        ref.current.srcObject = currentStream;
      });
  }, []);

  return <video playsInline muted autoPlay ref={ref} />;
});

export default Video;
