import React from "react";
import { Layout } from "antd";
import SideBar from "../../components/chat/sidebar";
import ChatBody from "../../components/chat/chat-body";

const { Sider, Content } = Layout;

const Chat = () => {
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
        <SideBar />
      </Sider>
      <Layout style={{ padding: 20 }}>
        <Content>
          <ChatBody />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
