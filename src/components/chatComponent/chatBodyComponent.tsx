import { useContext, useEffect, useRef, useState } from "react";
import { SendOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatContext } from "../../context/chatContext";
import { SET_MESSAGE } from "../../constants/actions";
import { AuthContext } from "../../context";
import { LocalStorage } from "../../util/localStorage";
import { CustomModal } from "../../common";
import { VideoContext } from "../../context/videoContext";
import AddUserListModal from "./sidebar/addUserListModal";
import ChatBoxComponent from "./chatBoxComponent";
import ChatBoxHeaderComponent from "./chatBoxHeaderComponent";
import { UploadPhoto } from "../../common";
import { Divider } from "antd";
import Styles from "./chatBodyComponent.module.css";
import { getCurrentDate } from "../../util/date";

export const ChatBodyComponent = () => {
  const inputRef = useRef<any>(null);
  const imageRef = useRef<any>(null);

  const messagesEndRef = useRef<any>(null);
  const modalRef = useRef<any>(null);
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);

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
  const onClickSend = () => {
    let message: any = {
      connectionId: state?.user.connectionId,
      sentBy: authState.user?._id,
      sentTo: state.user._id,
      text: inputRef.current.value,
      updatedAt: getCurrentDate(),
    };
    if (imageRef.current) {
      const image = {
        name: imageRef.current.name,
        size: imageRef.current.size,
        data: imageRef.current.thumbUrl,
        type: imageRef.current.type,
      };
      message = { ...message, image };
    }

    const body = {
      messageId: state?.user.messageId,
      createdAt: getCurrentDate(),
      connectionId: state?.user.connectionId,
      message,
    };
    socket.emit("send_message", body);
    inputRef.current.value = "";
  };

  return (
    <>
      <CustomModal ref={modalRef} title="Create a group" footer={false}>
        <AddUserListModal closeModal={closeModal} />
      </CustomModal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            justifySelf: "flex-start",
            height: "100%",
            overflow: "scroll",
          }}
        >
          <ChatBoxHeaderComponent modalRef={modalRef} />
          <ChatBoxComponent />
        </div>
        <div className={Styles.messageInputWrapper}>
          {showUploadFile && (
            <div>
              <UploadPhoto
                handleChange={(item: any) => (imageRef.current = item)}
              />
              <Divider />
            </div>
          )}
          <div className={Styles.sendNewMessage}>
            <button
              className="addFiles"
              onClick={() => setShowUploadFile(!showUploadFile)}
            >
              {showUploadFile ? <CloseOutlined /> : <PlusOutlined />}
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              ref={inputRef}
            />
            <button
              className="btnSendMsg"
              id="sendMsgBtn"
              onClick={onClickSend}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
