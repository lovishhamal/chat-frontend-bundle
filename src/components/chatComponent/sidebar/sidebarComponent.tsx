import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { getUserListService } from "../../../services/chat/user";
import SearchUserList from "./searchUserList";
import UserList from "./userList";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { logout } from "../../../util/common";
import { useNavigate } from "react-router-dom";
import { uiRoutes } from "../../../constants/uiRoutes";
import Styles from "./sidebarComponent.module.css";
import { Typography } from "antd";

export const SideBarComponent = () => {
  const navigate = useNavigate();
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
    <div
      style={{
        width: 300,
      }}
    >
      <h2>Recent Chats</h2>
      <div className={Styles.chatListSearch}>
        <div className={Styles.searchWrap}>
          <input
            type='text'
            placeholder='Search Here'
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
  );
};
