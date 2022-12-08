import { httpMethod } from "../../api/httpMethodd";
import { apiRoutes } from "../../constants/apiRoutes";

export const registerService = async (payload: any) => {
  try {
    const response = await httpMethod.post(apiRoutes.auth.register, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginService = async (payload: any) => {
  try {
    const response = await httpMethod.post(apiRoutes.auth.login, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
