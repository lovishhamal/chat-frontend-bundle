import React, { useContext, useEffect, useState } from "react";
import mockUsers from "../../json/MOCK_DATA.json";

import { Avatar, Badge, Divider, List, Skeleton, Typography } from "antd";
import {
  IUserMessage,
  IUserProps,
} from "../../interface/components/chat/chatInterface";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatContext } from "../../context/chatContext";
import { SET_INITIAL_MESSAGE, SET_USER } from "../../constants/actions";
import AvatarComponent from "../../common/avatar";
import { getUserService } from "../../services/chat/user";
import { AuthContext } from "../../context";
import { getMessageService } from "../../services/chat/message";

const { Title, Paragraph } = Typography;

export const SideBarComponent = () => {
  const { dispatch, state: chatState } = useContext<any>(ChatContext);
  const { state } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserProps[]>([]);

  const getUsers = () => {
    getUserService(state.user._id).then((data) => {
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
    getMessageService(item._id).then((data: IUserMessage[]) => {
      dispatch({ type: SET_INITIAL_MESSAGE, payload: data });
    });
    dispatch({
      type: SET_USER,
      payload: item,
    });
  };

  return (
    <div style={{ margin: "-20px 20px 0px 20px" }}>
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
          hasMore={users?.length < 0 || false}
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
                      <AvatarComponent image={item.image.data} active={true} />
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
