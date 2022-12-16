import { httpMethod } from "../../api/httpMethodd";
import { apiRoutes } from "../../constants/apiRoutes";

export const getMessageService = async (id: string) => {
  try {
    const response = await httpMethod.get(
      apiRoutes.chat.messages.getAll.replace(":id", id)
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
