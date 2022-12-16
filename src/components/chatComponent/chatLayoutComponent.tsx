import { Layout, Typography } from "antd";
import React, { useContext } from "react";
import AvatarComponent from "../../common/avatar";
import { ChatContext } from "../../context/chatContext";
import { ChatBodyComponent } from "./chatBodyComponent";

const { Content, Header } = Layout;
const { Title, Paragraph } = Typography;

export const ChatLayoutComponent = () => {
  const {
    state: { user },
  } = useContext<any>(ChatContext);

  return (
    <Layout>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <AvatarComponent image={user.image?.data} active={user.active} />
              <div
                style={{
                  alignSelf: "flex-start",
                  marginLeft: 10,
                }}
              >
                <Title level={5} style={{ padding: 0, margin: 0 }}>
                  {user.displayName}
                </Title>
                <Paragraph style={{ padding: 0, margin: 0 }}>
                  {user.active && "Active Now"}
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Content>
        <ChatBodyComponent />
      </Content>
    </Layout>
  );
};
