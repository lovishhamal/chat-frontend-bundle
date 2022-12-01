import { format, compareAsc } from "date-fns";

export const formatDate = (date: string, dateFormat = "MM/dd/yyyy") => {
  return format(new Date(date), dateFormat);
};

export const getCurrentDate = () => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
};
