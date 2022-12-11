import React, { useContext, useEffect, useState } from "react";
import mockUsers from "../../json/MOCK_DATA.json";

import { Avatar, Badge, Divider, List, Skeleton, Typography } from "antd";
import { IUserProps } from "../../interface/components/chat/chatInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatContext } from "../../context/chatContext";
import { SET_USER } from "../../constants/actions";
import AvatarComponent from "../../common/avatar";
import { getUserService } from "../../services/chat";

const { Title, Paragraph } = Typography;

export const SideBarComponent = () => {
  const { dispatch } = useContext<any>(ChatContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserProps[]>();

  const getUsers = () => {
    getUserService().then((data) => {
      setUsers(data);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setUsers([]);
    setLoading(false);
  };

  const onPressUser = (item: IUserProps) => {
    dispatch({
      type: SET_USER,
      payload: item,
    });
  };
  console.log("ll", users);

  return (
    <div style={{ margin: "-20px 10px 0px 20px" }}>
      <Title>Users</Title>
      <div
        id='scrollableDiv'
        style={{
          height: "90vh",
          overflow: "auto",
          padding: "0 16px",
        }}
      >
        <InfiniteScroll
          dataLength={users?.length ?? 0}
          next={loadMoreData}
          hasMore={(users?.length && users?.length < 10) || false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget='scrollableDiv'
        >
          <List
            dataSource={users}
            renderItem={(item: IUserProps) => (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onPressUser(item)}
              >
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <AvatarComponent image={item.image} active={true} />
                    }
                    title={<Title level={5}>{item.userName}</Title>}
                    description={<Paragraph>{"iitem"}</Paragraph>}
                  />
                </List.Item>
              </div>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};
