import React, { useContext } from "react";
import { DatePicker } from "antd";
import Chat from "./pages/chat/chat";
import { ChatContext, ChatReducer } from "./context/chat";

const App = () => {
  const { state, dispatch } = ChatReducer();
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <Chat />
    </ChatContext.Provider>
  );
};

export default App;
