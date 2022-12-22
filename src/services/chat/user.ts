import { httpMethod } from "../../api/httpMethodd";
import { apiRoutes } from "../../constants/apiRoutes";

export const getUserService = async (id: string) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.users.getAll.replace(":id", id)
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserListService = async (value: string) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.users.getUserList.replace("value", value)
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
