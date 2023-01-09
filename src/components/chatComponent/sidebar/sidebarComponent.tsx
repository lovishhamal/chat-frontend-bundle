import { useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { getUserListService } from "../../../services/chat/user";
import SearchUserList from "./searchUserList";
import UserList from "./userList";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Styles from "./sidebarComponent.module.css";
import { CustomModal } from "../../../common";
import AddUserListModal from "./addUserListModal";

export const SideBarComponent = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
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
      <CustomModal
        open={open}
        setOpen={setOpen}
        title='Create a group'
        footer={false}
      >
        <AddUserListModal setOpen={setOpen} />
      </CustomModal>
      <div
        style={{
          width: 300,
        }}
      >
        <div className={Styles.btn} onClick={() => setOpen(true)}>
          <div>
            <PlusOutlined />
          </div>
          <div style={{ margin: "0px 2px 0px 2px" }} />
          <p>Create group</p>
        </div>
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
    </>
  );
};
