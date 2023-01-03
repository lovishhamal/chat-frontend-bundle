import { List } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, ChatContext } from "../../../context";
import { IUserProps } from "../../../interface/components/chat/chatInterface";
import { geAllConnectionService } from "../../../services/chat/user";
import { CheckCircleOutlined } from "@ant-design/icons";
import Styles from "./sidebarComponent.module.css";

const AddUserListModal = ({ setOpen }: { setOpen: any }) => {
  const { state } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<any>([]);

  const getUsers = () => {
    geAllConnectionService(state.user._id).then((data) => {
      if (data?.length) {
        setUsers(data);
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onCreate = () => {
    setOpen(false);
  };

  return (
    <>
      <List
        itemLayout='horizontal'
        dataSource={users}
        renderItem={(item) => {
          return (
            <div
              onClick={() => {
                if (selectedUserId.includes(item._id)) {
                  setSelectedUserId(
                    selectedUserId.filter((val: any) => item._id !== val)
                  );
                } else {
                  setSelectedUserId([...selectedUserId, item._id]);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                height: 50,
                padding: "5px 10px 5px 10px",
                margin: "15px 0px 15px 0px",
                borderRadius: 4,
                justifyContent: "space-between",
                backgroundColor: "#ecefff",
              }}
            >
              <h1>{item.userName}</h1>
              <CheckCircleOutlined
                style={{
                  fontSize: 20,
                  color: selectedUserId.includes(item._id)
                    ? "#39e600"
                    : "#666666",
                }}
              />
            </div>
          );
        }}
      />
      <div style={{ display: "flex" }}>
        <div className={Styles.btnCancel} onClick={() => setOpen(false)}>
          <p>Cancel</p>
        </div>
        <div style={{ margin: "0px 5px 0px 5px" }} />
        <div className={Styles.btnCreate} onClick={onCreate}>
          <p>Create group</p>
        </div>
      </div>
    </>
  );
};

export default AddUserListModal;
