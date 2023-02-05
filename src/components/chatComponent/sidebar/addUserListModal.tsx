import { List } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ChatContext } from "../../../context";
import { IUserProps } from "../../../interface/components/chat/chatInterface";
import {
  createUserGroupService,
  geAllConnectionService,
} from "../../../services/communication/chat/user";
import { CheckCircleOutlined } from "@ant-design/icons";
import Styles from "./addUserModal.module.css";
import { ConnectionType } from "../../../enums/common";

const AddUserListModal = (data: any) => {
  const inputRef = useRef<any>(null);
  const { state: authState } = useContext<any>(AuthContext);
  const { state } = useContext<any>(ChatContext);
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<any>([]);

  const getUsers = () => {
    geAllConnectionService(authState.user._id, state.user_id).then((data) => {
      if (data?.length) {
        setUsers(data);
      }
    });
  };

  useEffect(() => {
    if (state?.user?._id) {
      getUsers();
    }
  }, [state.user._id]);

  const onCreate = () => {
    const payload = {
      creatorId: authState.user._id,
      connectionIds: selectedUserId,
      connectionType: ConnectionType.GROUP,
    };

    createUserGroupService(payload)
      .then((data) => {})
      .catch((err) => {});
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
        <div className={Styles.btnCancel} onClick={() => {}}>
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
