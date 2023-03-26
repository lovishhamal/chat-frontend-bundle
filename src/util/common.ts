import { LocalStorage } from "./localStorage";

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const logout = async () => {
  return await LocalStorage.removeLocalStorage("user");
};
