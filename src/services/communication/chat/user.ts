import { httpMethod } from "../../../api/httpMethod";
import { apiRoutes } from "../../../constants/apiRoutes";
import { formatConnectionResponse } from "../../util/chat";

export const geAllConnectionService = async (
  id: string,
  connectionId: string
) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.users.getAllConnections.replace(":id", id),
      {
        params: { connectionId },
      }
    );
    return formatConnectionResponse(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const getUserListService = async (id: string, payload: string) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.users.getUserFriends
        .replace(":id", id)
        .replace("value", payload)
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createUserConnectionService = async (value: any) => {
  try {
    const response = await httpMethod.post(apiRoutes.user.connection, value);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createUserGroupService = async (value: any) => {
  try {
    const response = await httpMethod.post(
      apiRoutes.user.groupConnection,
      value
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
