import { useContext, useState } from "react";
import { List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { IUserProps } from "../../../interface/components/chat/chatInterface";
import { AuthContext } from "../../../context";
import { createUserConnectionService } from "../../../services/communication/chat/user";
import UserListItem from "./userListItem";
import { ConnectionType } from "../../../enums/common";

const SearchUserList = ({ data }: { data: any }) => {
  const { state } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);

  const onPressUser = (item: IUserProps) => {
    createUserConnectionService({
      id: state?.user?._id,
      connectionId: { id: item._id },
      connectionType: ConnectionType.INDIVIDDUAL,
    }).then((data: any) => {});
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);

    setLoading(false);
  };

  return (
    <InfiniteScroll
      dataLength={data?.length ?? 0}
      next={loadMoreData}
      hasMore={data?.length < 0 || false}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      scrollableTarget='scrollableDiv'
    >
      <List
        dataSource={data}
        renderItem={(item: IUserProps, index: number) => (
          <UserListItem index={index} item={item} onPress={onPressUser} />
        )}
      />
    </InfiniteScroll>
  );
};

export default SearchUserList;
