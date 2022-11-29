import React from "react";
import AvatarComponent from "../../common/avatar";
import { IUserMessage } from "../../interface/components/chat/chat";
import { formatDate } from "../../util/date";

const SenderBox = ({ item }: { item: IUserMessage }) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: 50,
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            padding: 10,
            backgroundColor: "rgb(0, 132, 255)",
            marginRight: 10,
            color: "white",
            width: "70%",
          }}
        >
          {item.message}
        </div>
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

export default SenderBox;
