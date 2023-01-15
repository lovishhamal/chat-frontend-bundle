import { Divider, List } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/chatContext";
import { IMessage } from "../../interface/components/chat/chatInterface";

import {
  SendOutlined,
  PlusOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getCurrentDate } from "../../util/date";
import { SET_MESSAGE } from "../../constants/actions";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { AuthContext } from "../../context";
import { LocalStorage } from "../../util/localStorage";
import Styles from "./chatBodyComponent.module.css";
import { UploadPhoto } from "../../common";
import AvatarComponent from "../../common/avatar";
import { VideoContext } from "../../context/videoContext";

export const ChatBodyComponent = () => {
  const { socket, callUser } = useContext<any>(VideoContext);

  const messagesEndRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const { state, dispatch } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);

  useEffect(() => {
    socket.emit("new-user-add", authState.user?._id);
    socket.on("initialMessage", (res: any) => {
      console.log("message ,recieved", res);
    });
  }, []);

  useEffect(() => {
    socket.off("recieve-message").on("recieve-message", async (res: any) => {
      let item: any = await LocalStorage.getLocalStorage("item");
      if (item) {
        item = JSON.parse(item);
        if (res.connectionId == item.connectionId) {
          dispatch({ type: SET_MESSAGE, payload: res });
        }
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef.current, state]);

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
    <div style={{ width: "100%" }}>
      <div className={Styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <AvatarComponent image={state.user?.image?.data} />
          <h1 style={{ textTransform: "capitalize" }}>{state.user.userName}</h1>
        </div>
        <div className={Styles.iconWrapper}>
          <div className={Styles.icon}>
            <PhoneOutlined />
          </div>
          <div className={Styles.iconGap} />
          <div
            className={Styles.icon}
            onClick={() => {
              const receiver = {
                id: state.user._id,
                name: state.user.userName,
                image: state.user.image.data,
              };
              callUser(receiver);
            }}
          >
            <VideoCameraOutlined />
          </div>
        </div>
      </div>
      <div className={Styles.mainChatContent}>
        <div className={Styles.contentBody}>
          <List
            style={{ width: "100%", overflow: "scroll" }}
            itemLayout='horizontal'
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
              <h1>Hello</h1>
              <Divider style={{ backgroundColor: "red" }} />
            </div>
          )}
          <div className={Styles.sendNewMessage}>
            <button
              className='addFiles'
              onClick={() => setShowUploadFile(!showUploadFile)}
            >
              {showUploadFile ? <CloseOutlined /> : <PlusOutlined />}
            </button>
            <input
              type='text'
              placeholder='Type a message here'
              ref={inputRef}
            />
            <button
              className='btnSendMsg'
              id='sendMsgBtn'
              onClick={onClickSend}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
