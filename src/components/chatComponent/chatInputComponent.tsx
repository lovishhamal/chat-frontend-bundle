import { useContext, useRef, useState } from "react";
import { UploadPhoto } from "../../common";
import { Divider } from "antd";
import Styles from "./chatBodyComponent.module.css";
import { getCurrentDate } from "../../util/date";
import { SendOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatContext } from "../../context";

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

  const onClickSend = () => {
    let message: any = {
      connectionId: state?.user.connectionId,
      sentBy: authState.user?._id,
      sentTo: state.user._id,
      text: inputRef.current.value,
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
    socket.emit("send_message", body);
    inputRef.current.value = "";
    imageRef.current = "";
    setShowUploadFile(false);
  };

  return (
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
        <input type="text" placeholder="Type a message here" ref={inputRef} />
        <button className="btnSendMsg" id="sendMsgBtn" onClick={onClickSend}>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatInputComponent;
