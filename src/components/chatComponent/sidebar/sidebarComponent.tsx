import { useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { getUserListService } from "../../../services/communication/chat/user";
import SearchUserList from "./searchUserList";
import UserList from "./userList";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import Styles from "./sidebarComponent.module.css";
import { logout } from "../../../util";
import { uiRoutes } from "../../../constants";
import { useNavigate } from "react-router-dom";

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
    <>
      <div
        style={{
          width: 300,
        }}
      >
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            Hi{" "}
            <span style={{ textTransform: "capitalize" }}>
              {state.user.userName}
            </span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={async () => {
              await logout();
              navigate(uiRoutes.auth.login);
            }}
          >
            <LogoutOutlined />
          </div>
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
