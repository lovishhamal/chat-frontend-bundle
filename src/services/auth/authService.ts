import { httpMethod } from "../../api/httpMethod";
import { apiRoutes } from "../../constants/apiRoutes";

export const registerService = async (payload: any) => {
  try {
    const response = await httpMethod.post(apiRoutes.auth.register, payload);
    return response.data.data;
  } catch (error: any) {
    throw error?.response;
  }
};

export const loginService = async (payload: any) => {
  try {
    const response = await httpMethod.post(apiRoutes.auth.login, payload);
    return response.data.data;
  } catch (error: any) {
    throw error?.response;
  }
};
