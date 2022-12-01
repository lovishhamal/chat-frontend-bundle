import { Form, List } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import AvatarComponent from "../../common/avatar";
import { ChatContext } from "../../context/chat";
import { IUserMessage } from "../../interface/components/chat/chat";
import ReceiverBox from "./receiverBox";
import SenderBox from "./senderBox";
import { io } from "socket.io-client";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { getCurrentDate } from "../../util/date";
import { SET_MESSAGE } from "../../constants/actions";

const { TextArea } = Input;

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const uuid = Math.random() * 100;

const ChatContent = () => {
  const [form] = Form.useForm();
  const socket = useRef(
    io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    })
  );

  const { state, dispatch } = useContext<any>(ChatContext);

  useEffect(() => {
    socket.current.emit("join_room", "dwf_room");
    socket.current.off("initialMessage").on("initialMessage", (res: any) => {
      console.log("message ,recieved", res);
    });
  }, []);

  useEffect(() => {
    socket.current.off("receiveMessage").on("receiveMessage", (res: any) => {
      dispatch({ type: SET_MESSAGE, payload: res });
    });
  }, []);

  const onClickSend = async () => {
    socket.current.emit("sendMessage", {
      createdAt: getCurrentDate(),
      displayName: "Lovish Hamal",
      id: uuid,
      message: form.getFieldValue("chat"),
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
            return +uuid === +item.id ? (
              <SenderBox item={item} />
            ) : (
              <ReceiverBox item={item} />
            );
          }}
        />
      </div>
      <div
        style={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <Form
          form={form}
          style={{ width: "100%", marginRight: 20 }}
          onFinish={onClickSend}
        >
          <Form.Item name='chat'>
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

export default ChatContent;
