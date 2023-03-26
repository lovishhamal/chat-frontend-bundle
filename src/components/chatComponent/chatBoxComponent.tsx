import { useContext } from "react";
import { List } from "antd";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { IMessage } from "../../interface/components/chat/chatInterface";
import Styles from "./chatBodyComponent.module.css";
import { AuthContext, ChatContext } from "../../context";

const ChatBoxComponent = () => {
  const { state } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);

  return (
    <div className={Styles.mainChatContent}>
      <div>
        <List
          style={{ width: "100%", overflow: "scroll", zIndex: 0 }}
          className={Styles.list}
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
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ChatBoxComponent;
