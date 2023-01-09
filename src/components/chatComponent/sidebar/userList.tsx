import { useContext, useEffect, useState } from "react";
import { List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  IUserMessage,
  IUserProps,
} from "../../../interface/components/chat/chatInterface";
import { getMessageService } from "../../../services/chat/message";
import { SET_INITIAL_MESSAGE, SET_USER } from "../../../constants/actions";
import { AuthContext, ChatContext } from "../../../context";
import { geAllConnectionService } from "../../../services/chat/user";
import UserListItem from "./userListItem";

const UserList = () => {
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
      scrollableTarget='scrollableDiv'
    >
      <List
        dataSource={users}
        renderItem={(item: IUserProps, index: number) => (
          <UserListItem
            selectedUserId={chatState.user._id}
            index={index}
            item={item}
            onPress={onPressUser}
          />
        )}
      />
    </InfiniteScroll>
  );
};

export default UserList;
