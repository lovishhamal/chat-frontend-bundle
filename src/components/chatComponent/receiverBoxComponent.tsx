import React from "react";
import AvatarComponent from "../../common/avatar";
import {
  IMessage,
  IUserMessage,
} from "../../interface/components/chat/chatInterface";
import { formatDate } from "../../util/date";
import Styles from "./chatBodyComponent.module.css";

export const ReceiverBoxComponent = ({ item }: { item: IMessage }) => {
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
        <div className={Styles.chatMessage}>{item.text}</div>
        {item?.image?.data && <img src={item.image.data} />}
        <p style={{ alignSelf: "start", marginLeft: 10 }}>
          {formatDate(item?.updatedAt, "PPP, p")}
        </p>
      </div>
    </div>
  );
};
