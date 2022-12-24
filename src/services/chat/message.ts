import { httpMethod } from "../../api/httpMethodd";
import { apiRoutes } from "../../constants/apiRoutes";

export const getMessageService = async (payload: any) => {
  try {
    const response = await httpMethod.post(
      apiRoutes.chat.messages.getAll,
      payload
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
