import { useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { getUserListService } from "../../../services/communication/chat/user";
import SearchUserList from "./searchUserList";
import UserList from "./userList";
import { SearchOutlined } from "@ant-design/icons";

import Styles from "./sidebarComponent.module.css";

export const SideBarComponent = () => {
  const [data, setData] = useState<any>([]);
  const { state } = useContext<any>(AuthContext);

  const onChange = async (e: any) => {
    const { value } = e.target;
    if (value?.length == 2) {
      const response = await getUserListService(state?.user._id, value);
      setData(response);
    }
    if (!value) {
      setData([]);
    }
  };

  return (
    <>
      <div
        style={{
          width: 300,
        }}
      >
        <div style={{ marginTop: 20 }}>
          Hi{" "}
          <span style={{ textTransform: "capitalize" }}>
            {state.user.userName}
          </span>
        </div>
        <h2>Recent Chats</h2>
        <div className={Styles.chatListSearch}>
          <div className={Styles.searchWrap}>
            <input
              type="text"
              placeholder="Search Here"
              required
              onChange={onChange}
            />
            <button className={Styles.searchBtn}>
              <SearchOutlined />
            </button>
          </div>
        </div>
        <div className={Styles.chatlistItems}>
          <div className={Styles.chatlistItem}>
            {data?.length ? <SearchUserList data={data} /> : <UserList />}
          </div>
        </div>
      </div>
    </>
  );
};
