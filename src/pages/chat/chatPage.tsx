import React from "react";
import { Layout } from "antd";
import {
  SideBarComponent,
  ChatLayoutComponent,
} from "../../components/chatComponent";

const { Sider, Content } = Layout;

const ChatPage = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "white",
        }}
        width={500}
      >
        <SideBarComponent />
      </Sider>
      <Layout style={{ padding: 20 }}>
        <Content>
          <ChatLayoutComponent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
