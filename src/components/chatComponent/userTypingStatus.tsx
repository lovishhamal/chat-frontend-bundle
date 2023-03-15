import { useEffect, useRef, useState } from "react";

const UserTypingStatus = ({ socket, userId, ref }: any) => {
  const messagesEndRef = useRef<any>(null);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    socket.on("user-input", (data: any) => {
      if (data.id !== userId) {
        setStatus(data.firstName);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);

  return (
    <>
      {status ? (
        <div
          style={{
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            {status} is typing
          </div>
        </div>
      ) : (
        ""
      )}
      <div ref={messagesEndRef} />
    </>
  );
};

export default UserTypingStatus;
