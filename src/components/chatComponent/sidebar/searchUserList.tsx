import { useContext, useEffect, useState } from "react";
import { Divider, List, Skeleton } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import InfiniteScroll from "react-infinite-scroll-component";
import AvatarComponent from "../../../common/avatar";
import { IUserProps } from "../../../interface/components/chat/chatInterface";

import { AuthContext, ChatContext } from "../../../context";
import { postUserConnection } from "../../../services/chat/user";

const SearchUserList = ({ data }: { data: any }) => {
  const { state } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);

  const onPressUser = (item: IUserProps) => {
    postUserConnection({
      id: state?.user?._id,
      connectionId: { id: item._id },
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
      endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      scrollableTarget='scrollableDiv'
    >
      <List
        dataSource={data}
        renderItem={(item: IUserProps) => (
          <div style={{ cursor: "pointer" }} onClick={() => onPressUser(item)}>
            <List.Item>
              <List.Item.Meta
                title={<Title level={5}>{item.userName}</Title>}
                description={
                  <Paragraph>{`${item.userName} wants to be your friend 😁`}</Paragraph>
                }
              />
            </List.Item>
          </div>
        )}
      />
    </InfiniteScroll>
  );
};

export default SearchUserList;
