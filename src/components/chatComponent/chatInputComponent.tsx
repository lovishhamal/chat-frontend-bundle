import { useContext, useEffect, useRef, useState } from "react";
import { UploadPhoto } from "../../common";
import { Divider } from "antd";
import Styles from "./chatBodyComponent.module.css";
import { getCurrentDate } from "../../util/date";
import { SendOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatContext } from "../../context";
import UserTypingStatus from "./userTypingStatus";

const ChatInputComponent = ({
  socket,
  authState,
}: {
  socket: any;
  authState: any;
}) => {
  const inputRef = useRef<any>(null);
  const imageRef = useRef<any>(null);

  const { state } = useContext<any>(ChatContext);
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);
  const [typingTimer, setTypingTimer] = useState<any>(null);
  const userTypingInfo = useRef<any>({ isTyping: false });
  const doneTypingInterval = 2000;

  useEffect(() => {
    // event handler for keyup events on the input field
    const handleKeyUp = () => {
      clearTimeout(typingTimer);

      // start a new timer with a delay of 2 seconds
      setTypingTimer(
        setTimeout(() => {
          socket.emit("user-input", {
            connectionId: state?.user.connectionId,
            firstName: authState.user.firstName,
            id: authState.user?._id,
            typing: false,
          });
        }, doneTypingInterval)
      );
    };

    const inputField: any = document.getElementById("myInput");
    inputField.addEventListener("keyup", handleKeyUp);

    // clean up the event listener when the component unmounts
    return () => {
      inputField.removeEventListener("keyup", handleKeyUp);
    };
  }, [typingTimer]);

  const onClickSend = () => {
    const messagetext = inputRef.current.value;
    if (!messagetext) return;

    let message: any = {
      connectionId: state?.user.connectionId,
      sentBy: authState.user?._id,
      sentTo: state.user._id,
      text: messagetext,
      updatedAt: getCurrentDate(),
    };
    if (imageRef.current) {
      const image = {
        name: imageRef.current.name,
        size: imageRef.current.size,
        data: imageRef.current.thumbUrl,
        type: imageRef.current.type,
      };
      message = { ...message, image };
    }

    const body = {
      messageId: state?.user.messageId,
      createdAt: getCurrentDate(),
      connectionId: state?.user.connectionId,
      message,
    };
    socket.emit("user-input", {
      connectionId: state?.user.connectionId,
      firstName: authState.user.firstName,
      id: authState.user?._id,
      isTyping: false,
    });
    socket.emit("send_message", body);
    inputRef.current.value = "";
    imageRef.current = "";
    setShowUploadFile(false);
  };

  const onChangeInput = () => {
    if (
      !userTypingInfo.current.isTyping ||
      userTypingInfo.current.id !== authState.user?._id
    ) {
      socket.emit("user-input", {
        connectionId: state?.user.connectionId,
        firstName: authState.user.firstName,
        id: authState.user?._id,
        isTyping: true,
      });
    }
  };

  return (
    <>
      <UserTypingStatus
        socket={socket}
        userId={authState.user._id}
        onUserStoppedTyping={(typingInfo: any) => {
          userTypingInfo.current = typingInfo;
        }}
      />
      <div className={Styles.messageInputWrapper}>
        {showUploadFile && (
          <div>
            <UploadPhoto
              handleChange={(item: any) => (imageRef.current = item)}
            />
            <Divider />
          </div>
        )}
        <div className={Styles.sendNewMessage}>
          <button
            className="addFiles"
            onClick={() => setShowUploadFile(!showUploadFile)}
          >
            {showUploadFile ? <CloseOutlined /> : <PlusOutlined />}
          </button>
          <input
            id="myInput"
            type="text"
            placeholder="Type a message here"
            ref={inputRef}
            onChange={onChangeInput}
            onKeyDown={(e: any) => {
              if (e?.code === "Enter") {
                onClickSend();
              }
            }}
          />
          <button className="btnSendMsg" id="sendMsgBtn" onClick={onClickSend}>
            <SendOutlined />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInputComponent;
