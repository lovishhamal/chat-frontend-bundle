import { useContext } from "react";
import {
  PlusOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Styles from "./chatBodyComponent.module.css";
import AvatarComponent from "../../common/avatar";
import { VideoContext } from "../../context/videoContext";
import { AuthContext, ChatContext } from "../../context";

const ChatBoxHeader = ({ modalRef }: { modalRef: any }) => {
  const { callUser } = useContext<any>(VideoContext);
  const { state } = useContext<any>(ChatContext);
  const { state: authState } = useContext<any>(AuthContext);

  return (
    <div className={Styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <AvatarComponent image={state.user?.image?.data} />
        <h1 style={{ textTransform: "capitalize" }}>{state.user.userName}</h1>
      </div>
      <div className={Styles.iconWrapper}>
        <div
          className={Styles.icon}
          onClick={() => modalRef.current.openModal(state.user._id)}
        >
          <PlusOutlined />
        </div>
        <div className={Styles.iconGap} />
        <div className={Styles.icon}>
          <PhoneOutlined />
        </div>
        <div className={Styles.iconGap} />
        <div
          className={Styles.icon}
          onClick={() => {
            const receiver = {
              connectionId: state.user.connectionId,
              receiver_id: state.user._id,
              caller_id: authState.user._id,
              name: authState.user.userName,
              image: authState.user.image.data,
            };
            callUser(receiver);
          }}
        >
          <VideoCameraOutlined />
        </div>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
