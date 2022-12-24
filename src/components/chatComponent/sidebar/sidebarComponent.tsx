import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { getUserListService } from "../../../services/chat/user";
import SearchUserList from "./searchUserList";
import UserList from "./userList";

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
      <div style={{ margin: "-20px 20px 0px 20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Title>Hi {state?.user.userName ?? ""}</Title>
          <Search
            placeholder='Email, userName'
            onChange={onChange}
            enterButton
          />
        </div>
        <div
          id='scrollableDiv'
          style={{
            height: "90vh",
            overflow: "auto",
            padding: "0 16px",
          }}
        >
          {data?.length ? <SearchUserList data={data} /> : <UserList />}
        </div>
      </div>
    </>
  );
};
