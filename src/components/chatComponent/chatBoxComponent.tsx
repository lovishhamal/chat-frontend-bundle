import { useContext, useRef, useState } from "react";
import { Divider, List } from "antd";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { IMessage } from "../../interface/components/chat/chatInterface";
import Styles from "./chatBodyComponent.module.css";
import { SendOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { AuthContext, ChatContext } from "../../context";
import { VideoContext } from "../../context/videoContext";
import { getCurrentDate } from "../../util/date";
import { UploadPhoto } from "../../common";

const ChatBoxComponent = () => {
  const { socket } = useContext<any>(VideoContext);
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);
  const { state } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);
  const inputRef = useRef<any>(null);
  const imageRef = useRef<any>(null);

  const messagesEndRef = useRef<any>(null);
  const modalRef = useRef<any>(null);

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
  };

  return (
    <div className={Styles.mainChatContent}>
      <div
        className={
          showUploadFile ? Styles.contentBody : Styles.contentBodyOverflow
        }
      >
        <List
          style={{ width: "100%", overflow: "scroll" }}
          itemLayout="horizontal"
          dataSource={state.messages}
          renderItem={(item: IMessage) => {
            return (
              <>
                {authState?.user._id === item.sentBy ? (
                  <SenderBoxComponent item={item} />
                ) : (
                  <ReceiverBoxComponent item={item} />
                )}
                <div ref={messagesEndRef} />
              </>
            );
          }}
        />
      </div>
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
    </div>
  );
};

export default ChatBoxComponent;
