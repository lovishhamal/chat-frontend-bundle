import React, { useContext, useEffect, useState } from "react";
import mockUsers from "../../json/MOCK_DATA.json";

import { Avatar, Badge, Divider, List, Skeleton, Typography } from "antd";
import { IUserProps } from "../../interface/components/chat/chat";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatContext } from "../../context/chat";
import { SET_USER } from "../../constants/actions";
import AvatarComponent from "../../common/avatar";

const { Title, Paragraph } = Typography;

const SideBar = () => {
  const { dispatch } = useContext<any>(ChatContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserProps[]>();

  useEffect(() => {
    loadMoreData();
  }, []);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setUsers(mockUsers);
    setLoading(false);
  };

  const onPressUser = (item: IUserProps) => {
    dispatch({
      type: SET_USER,
      payload: item,
    });
  };

  return (
    <div style={{ margin: "-20px 10px 0px 20px" }}>
      <Title>Users</Title>
      <div
        id='scrollableDiv'
        style={{
          height: "90vh",
          overflow: "auto",
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          dataLength={users?.length ?? 0}
          next={loadMoreData}
          hasMore={(users?.length && users?.length < 60) || false}
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
                      <AvatarComponent
                        image={item.image}
                        active={item.active}
                      />
                    }
                    title={<Title level={5}>{item.displayName}</Title>}
                    description={<Paragraph>{item.lastMessage}</Paragraph>}
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

export default SideBar;
