import React from "react";
import { Layout } from "antd";
import {
  SideBarComponent,
  ChatLayoutComponent,
} from "../../components/chatComponent";
import { ChatContext, ChatReducer } from "../../context/chatContext";
import { MainLayout } from "../../layout";
import Styles from "./chatPage.module.css";

const { Sider, Content } = Layout;

const ChatPage = () => {
  const { state, dispatch } = ChatReducer();
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <MainLayout>
        <div className={Styles.chatContainer}>
          <div className={Styles.chatBody}>
            <SideBarComponent />
            <div className={Styles.border} />
            <ChatLayoutComponent />
          </div>
        </div>
      </MainLayout>
    </ChatContext.Provider>
  );
};

export default ChatPage;
