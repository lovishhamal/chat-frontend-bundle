import { Form, List } from "antd";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ChatContext } from "../../context/chatContext";
import { IUserMessage } from "../../interface/components/chat/chatInterface";

import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { getCurrentDate } from "../../util/date";
import { SET_MESSAGE } from "../../constants/actions";
import { SenderBoxComponent } from "./senderBoxComponent";
import { ReceiverBoxComponent } from "./receiverBoxComponent";
import { AuthContext } from "../../context";
import { socketIo } from "../../util/socket";
import { LocalStorage } from "../../util/localStorage";

const { TextArea } = Input;

export const ChatBodyComponent = () => {
  const socket = socketIo();
  const messagesEndRef = useRef<any>(null);
  const { state, dispatch } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);
  const [form] = Form.useForm();

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
    });
  }, []);

  const onClickSend = () => {
    socket.emit("send_message", {
      sentBy: authState.user?._id,
      sentTo: state.user._id,
      messageId: state?.user.messageId,
      createdAt: getCurrentDate(),
      displayName: "Lovish Hamal",
      message: form.getFieldValue("message"),
      connectionId: state?.user.connectionId,
    });

    form.resetFields();
  };

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "white",
        height: "84vh",
        padding: 20,
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        ref={messagesEndRef}
        style={{
          display: "flex",
          overflow: "auto",
          marginBottom: 10,
        }}
      >
        <List
          style={{ width: "100%" }}
          itemLayout='horizontal'
          dataSource={state.messages}
          renderItem={(item: IUserMessage) => {
            return authState?.user._id === item.sentBy ? (
              <SenderBoxComponent item={item} />
            ) : (
              <ReceiverBoxComponent item={item} />
            );
          }}
        />
      </div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Form
          form={form}
          style={{ width: "100%", marginRight: 20 }}
          onFinish={onClickSend}
        >
          <Form.Item name='message'>
            <TextArea
              rows={4}
              placeholder='Type a message'
              onPressEnter={onClickSend}
            />
          </Form.Item>
        </Form>
        <SendOutlined onClick={onClickSend} />
      </div>
    </div>
  );
};
