import { useEffect, useRef, useState } from "react";
import { TypingStatus } from "../../interface/components/chat/chatInterface";

const UserTypingStatus = ({ socket, userId, onUserStoppedTyping }: any) => {
  const messagesEndRef = useRef<any>(null);
  const [typingInfo, setTypingInfo] = useState<TypingStatus>({});

  useEffect(() => {
    socket.on("user-input", (data: any) => {
      onUserStoppedTyping(data);
      if (data.id !== userId) {
        setTypingInfo(data);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);

  return (
    <>
      {typingInfo?.isTyping ? (
        <div
          style={{
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            {typingInfo?.firstName} is typing
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default UserTypingStatus;
