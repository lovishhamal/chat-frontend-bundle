import { httpMethod } from "../../api/httpMethodd";
import { apiRoutes } from "../../constants/apiRoutes";

export const getUserService = async () => {
  try {
    const response = await httpMethod.get(apiRoutes.chat.users.getAll);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
