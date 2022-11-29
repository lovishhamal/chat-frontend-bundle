import { List } from "antd";
import React, { useContext } from "react";
import AvatarComponent from "../../common/avatar";
import { ChatContext } from "../../context/chat";
import { IUserMessage } from "../../interface/components/chat/chat";
import ReceiverBox from "./receiverBox";
import SenderBox from "./senderBox";

const ChatContent = () => {
  const { state } = useContext<any>(ChatContext);

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "white",
        height: "84vh",
        padding: 20,
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex" }}>
        <List
          itemLayout='horizontal'
          dataSource={state.messages}
          renderItem={(item: IUserMessage) =>
            item.sender ? (
              <SenderBox item={item} />
            ) : (
              <ReceiverBox item={item} />
            )
          }
        />
      </div>
    </div>
  );
};

export default ChatContent;
