import PeerContextProvider from "../../context/peerContext";
import VideoContextProvider from "../../context/videoContext";
import ChatPage from "./chatPage";

const ChatIndex = () => (
  <PeerContextProvider>
    <VideoContextProvider>
      <ChatPage />
    </VideoContextProvider>
  </PeerContextProvider>
);

export default ChatIndex;
