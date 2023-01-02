import { Form, List } from "antd";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ChatContext } from "../../context/chatContext";
import { IUserMessage } from "../../interface/components/chat/chatInterface";

import { SendOutlined, PlusOutlined } from "@ant-design/icons";
import { getCurrentDate } from "../../util/date";
import { SET_MESSAGE } from "../../constants/actions";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { AuthContext } from "../../context";
import { socketIo } from "../../util/socket";
import { LocalStorage } from "../../util/localStorage";
import Styles from "./chatBodyComponent.module.css";

export const ChatBodyComponent = () => {
  const socket = socketIo();
  const messagesEndRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const { state, dispatch } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);
  const [form] = Form.useForm();

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
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef.current]);

  const onClickSend = () => {
    socket.emit("send_message", {
      sentBy: authState.user?._id,
      sentTo: state.user._id,
      messageId: state?.user.messageId,
      createdAt: getCurrentDate(),
      displayName: "Lovish Hamal",
      message: inputRef.current.value,
      connectionId: state?.user.connectionId,
    });
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={Styles.mainChatContent}>
      <div className={Styles.contentBody}>
        <List
          style={{ width: "100%", overflow: "scroll" }}
          itemLayout='horizontal'
          dataSource={state.messages}
          renderItem={(item: IUserMessage) => {
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
      <div className={Styles.sendNewMessage}>
        <button className='addFiles'>
          <PlusOutlined />
        </button>
        <input type='text' placeholder='Type a message here' ref={inputRef} />
        <button className='btnSendMsg' id='sendMsgBtn' onClick={onClickSend}>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};
