import { useContext, useRef, useState } from "react";
import { List } from "antd";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { IMessage } from "../../interface/components/chat/chatInterface";
import Styles from "./chatBodyComponent.module.css";
import { AuthContext, ChatContext } from "../../context";
import { VideoContext } from "../../context/videoContext";
import { getCurrentDate } from "../../util/date";

const ChatBoxComponent = () => {
  const { state } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);

  const messagesEndRef = useRef<any>(null);

  return (
    <div className={Styles.mainChatContent}>
      <div>
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
    </div>
  );
};

export default ChatBoxComponent;
