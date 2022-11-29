import React from "react";
import AvatarComponent from "../../common/avatar";
import { IUserMessage } from "../../interface/components/chat/chat";
import { formatDate } from "../../util/date";

const ReceiverBox = ({ item }: { item: IUserMessage }) => {
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: 10,
            backgroundColor: "#F6F9FA",
            marginLeft: 10,
            width: "70%",
            alignItems: "flex-start",
          }}
        >
          {item.message}
        </div>
        <p style={{ alignSelf: "start", marginLeft: 10 }}>
          {" "}
          {formatDate(item.createdAt, "PPP, p")}
        </p>
      </div>
    </div>
  );
};

export default ReceiverBox;
