import React from "react";
import AvatarComponent from "../../common/avatar";
import { IUserMessage } from "../../interface/components/chat/chatInterface";
import { formatDate } from "../../util/date";
import Styles from "./chatBodyComponent.module.css";

export const ReceiverBoxComponent = ({ item }: { item: IUserMessage }) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: 50,
        alignItems: "flex-end",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ position: "relative", top: 30 }}>
        <AvatarComponent image='http://dummyimage.com/124x100.png/5fa2dd/ffffff' />
      </div>
      <div className={Styles.receiverBox}>
        <div className={Styles.chatMessage}>{item.message}</div>
        <p style={{ alignSelf: "start", marginLeft: 10 }}>
          {formatDate(item.createdAt, "PPP, p")}
        </p>
      </div>
    </div>
  );
};
