import AvatarComponent from "../../common/avatar";
import DoubleCheck from "../../common/seenIcon";
import {
  IMessage,
  IUserMessage,
} from "../../interface/components/chat/chatInterface";
import { formatDate } from "../../util/date";
import Styles from "./chatBodyComponent.module.css";

export const SenderBoxComponent = ({ item }: { item: IMessage }) => {
  return (
    <div className={Styles.senderContainer}>
      <div className={Styles.senderBox}>
        <div className={Styles.chatMessage}>{item.text}</div>
        {item?.image?.data && <img src={item.image.data} />}
        <p style={{ alignSelf: "flex-end", marginRight: 10 }}>
          {formatDate(item?.updatedAt, "PPP")}
        </p>
        <div className={Styles.doubleCheck}>
          <DoubleCheck color='blue' single={true} />
        </div>
      </div>
      <div style={{ position: "relative", top: 30 }}>
        <AvatarComponent image='http://dummyimage.com/124x100.png/5fa2dd/ffffff' />
      </div>
    </div>
  );
};
