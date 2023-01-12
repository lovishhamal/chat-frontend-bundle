import VideoContextProvider from "../../context/videoContext";
import ChatPage from "./chatPage";

const ChatIndex = () => (
  <VideoContextProvider>
    <ChatPage />
  </VideoContextProvider>
);

export default ChatIndex;
