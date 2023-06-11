import { ConnectionType } from "../../enums/common";

/** may need in future */
export const formatConnectionResponse = (response: any) => {
  const res = response.map((item: any) => {
    console.log("gg", item);

    const userId = item._id;
    const connection =
      item?.connectionType === ConnectionType.GROUP
        ? { connectionId: item.connectionId, messageId: item.messageId }
        : item.connection.find((item1: any) => item1.userId === userId);

    return {
      ...item,
      connectionId: connection?.connectionId ?? "",
      messageId: connection.messageId,
    };
  });

  return res;
};
