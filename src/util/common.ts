import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "@remix-run/router";
import { uiRoutes } from "../constants/uiRoutes";
import { LocalStorage } from "./localStorage";

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const logout = () => {
  return new Promise(async (resolve) => {
    await LocalStorage.removeLocalStorage("user");
    resolve("");
  });
};
