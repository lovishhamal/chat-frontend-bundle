import { Avatar } from "antd";
import React from "react";

const AvatarComponent = ({
  image,
  active = false,
}: {
  image?: string;
  active?: boolean;
}) => {
  return (
    <div style={{ position: "relative" }}>
      <Avatar src={image ?? ""} style={{ height: 50, width: 50 }} />
      {active && (
        <div
          style={{
            height: 28,
            width: 28,
            backgroundColor: "white",
            position: "absolute",
            right: -5,
            bottom: "-10%",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: 20,
              width: 20,
              backgroundColor: "#00cc00",
              borderWidth: 1,
              borderRadius: 10,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarComponent;
