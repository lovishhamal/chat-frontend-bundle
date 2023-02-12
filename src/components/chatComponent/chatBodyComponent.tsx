import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/chatContext";
import { SET_MESSAGE } from "../../constants/actions";
import { AuthContext } from "../../context";
import { LocalStorage } from "../../util/localStorage";
import { CustomModal } from "../../common";
import { VideoContext } from "../../context/videoContext";
import AddUserListModal from "./sidebar/addUserListModal";
import ChatBoxComponent from "./chatBoxComponent";
import ChatBoxHeaderComponent from "./chatBoxHeaderComponent";

export const ChatBodyComponent = () => {
  const messagesEndRef = useRef<any>(null);
  const modalRef = useRef<any>(null);

  const { socket } = useContext<any>(VideoContext);
  const { state, dispatch } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);

  const closeModal = () => {
    modalRef.current.closeModal();
  };

  useEffect(() => {
    socket.emit("new-user-add", authState.user?._id);
    socket.on("initialMessage", (res: any) => {
      console.log("message ,recieved", res);
    });
  }, []);

  useEffect(() => {
    socket.off("recieve-message").on("recieve-message", async (res: any) => {
      let item: any = await LocalStorage.getLocalStorage("item");
      if (item) {
        item = JSON.parse(item);
        if (res.connectionId == item.connectionId) {
          dispatch({ type: SET_MESSAGE, payload: res });
        }
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef.current, state]);

  return (
    <>
      <CustomModal ref={modalRef} title="Create a group" footer={false}>
        <AddUserListModal closeModal={closeModal} />
      </CustomModal>
      <div style={{ width: "100%" }}>
        <ChatBoxHeaderComponent modalRef={modalRef} />
        <ChatBoxComponent />
      </div>
    </>
  );
};
