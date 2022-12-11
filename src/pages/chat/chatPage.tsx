import React from "react";
import { Layout } from "antd";
import {
  SideBarComponent,
  ChatLayoutComponent,
} from "../../components/chatComponent";
import { ChatContext, ChatReducer } from "../../context/chatContext";

const { Sider, Content } = Layout;

const ChatPage = () => {
  const { state, dispatch } = ChatReducer();
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
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
    </ChatContext.Provider>
  );
};

export default ChatPage;
