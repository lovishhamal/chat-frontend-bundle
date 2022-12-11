import axios from "axios";

export const jack = "";

export const baseRequest = axios.create({
  baseURL: "http://localhost:5000/api",
});

export class httpMethod {
  static async post(path: string, body: any) {
    try {
      const response = await baseRequest.post(path, body);
      return response;
    } catch (error) {
      throw error;
    }
  }
  static async get(path: string) {
    try {
      const response = await baseRequest.get(path);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
