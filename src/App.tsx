import React, { useContext } from "react";
import { DatePicker } from "antd";
import { ChatContext, ChatReducer } from "./context/chatContext";
import ChatPage from "./pages/chat";

const App = () => {
  const { state, dispatch } = ChatReducer();
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <ChatPage />
    </ChatContext.Provider>
  );
};

export default App;
