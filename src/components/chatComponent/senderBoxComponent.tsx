import React from "react";
import AvatarComponent from "../../common/avatar";
import { IUserMessage } from "../../interface/components/chat/chatInterface";
import { formatDate } from "../../util/date";
import Styles from "./chatBodyComponent.module.css";

export const SenderBoxComponent = ({ item }: { item: IUserMessage }) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: 50,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        animationDelay: `0.8s`,
      }}
    >
      <div className={Styles.senderBox}>
        <div className={Styles.chatMessage}>{item.message}</div>
        <p style={{ alignSelf: "flex-end", marginRight: 10 }}>
          {formatDate(item.createdAt, "PPP")}
        </p>
      </div>
      <div style={{ position: "relative", top: 30 }}>
        <AvatarComponent image='http://dummyimage.com/124x100.png/5fa2dd/ffffff' />
      </div>
    </div>
  );
};
