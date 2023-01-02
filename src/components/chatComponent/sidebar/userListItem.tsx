import React from "react";
import AvatarComponent from "../../../common/avatar";
import { IUserProps } from "../../../interface/components/chat/chatInterface";
import Styles from "./sidebarComponent.module.css";

const UserListItem = ({
  index,
  selectedUserId,
  item,
  onPress,
}: {
  index: number;
  selectedUserId?: string;
  item: IUserProps;
  onPress: (item: any) => void;
}) => {
  return (
    <div
      style={{
        width: 230,
        animationDelay: `0.${index + 1}s`,
        marginTop: 20,
        padding: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      onClick={() => onPress(item)}
      className={selectedUserId === item._id ? Styles.chatlistItemActive : ""}
    >
      <AvatarComponent
        image={item.image ? item.image.data : "http://placehold.it/80x80"}
      />
      <div className='userMeta'>
        <p className={Styles.userName}>{item.userName}</p>
        <span className='activeTime'>32 mins ago</span>
      </div>
    </div>
  );
};

export default UserListItem;
