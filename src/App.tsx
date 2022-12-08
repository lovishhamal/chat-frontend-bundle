import { ChatContext, ChatReducer } from "./context/chatContext";
import { AppRoutes } from "./routes";

const App = () => {
  const { state, dispatch } = ChatReducer();
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <AppRoutes />;
    </ChatContext.Provider>
  );
};

export default App;
