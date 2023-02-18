import { httpMethod } from "../../../api/httpMethod";
import { apiRoutes } from "../../../constants/apiRoutes";

export const getMessageService = async (payload: any) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.messages.getAll,
      payload
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
