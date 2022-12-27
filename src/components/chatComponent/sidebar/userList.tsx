import { useContext, useEffect, useState } from "react";
import { Divider, List, Skeleton } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import InfiniteScroll from "react-infinite-scroll-component";
import AvatarComponent from "../../../common/avatar";
import {
  IUserMessage,
  IUserProps,
} from "../../../interface/components/chat/chatInterface";
import { getMessageService } from "../../../services/chat/message";
import { SET_INITIAL_MESSAGE, SET_USER } from "../../../constants/actions";
import { AuthContext, ChatContext } from "../../../context";
import { geAllConnectionService } from "../../../services/chat/user";
import { socketIo } from "../../../util/socket";
import { LocalStorage } from "../../../util/localStorage";

const UserList = () => {
  const socket = socketIo();
  const { state } = useContext<any>(AuthContext);
  const { state: chatState, dispatch } = useContext<any>(ChatContext);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserProps[]>([]);

  const getUsers = () => {
    geAllConnectionService(state.user._id).then((data) => {
      if (data?.length) {
        setUsers(data);
        dispatch({
          type: SET_USER,
          payload: data[0],
        });
        const payload = {
          messageId: data[0].messageId,
        };
        getMessageService(payload).then((value: IUserMessage[]) => {
          dispatch({ type: SET_INITIAL_MESSAGE, payload: value });
        });
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  //any will be removed
  const onPressUser = async (item: IUserProps | any) => {
    socket.emit("new-user-add", item._id);
    const payload = {
      messageId: item.messageId,
    };

    getMessageService(payload).then((data: IUserMessage[]) => {
      dispatch({ type: SET_INITIAL_MESSAGE, payload: data });
    });

    dispatch({
      type: SET_USER,
      payload: item,
    });
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setUsers([]);
    setLoading(false);
  };

  return (
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
          <div style={{ cursor: "pointer" }} onClick={() => onPressUser(item)}>
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
  );
};

export default UserList;
