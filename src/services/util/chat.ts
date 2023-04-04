import { ConnectionType } from "../../enums/common";

/** may need in future */
export const formatConnectionResponse = (response: any) => {
  const res = response.map((item: any) => {
    const userId = item._id;
    const connection =
      item.type === ConnectionType.INDIVIDDUAL
        ? item.connection.find((item1: any) => item1.userId === userId)
        : { connectionId: item.connectionId, messageId: item.messageId };
    return {
      ...item,
      connectionId: connection?.connectionId ?? "",
      messageId: connection.messageId,
    };
  });

  return res;
};
