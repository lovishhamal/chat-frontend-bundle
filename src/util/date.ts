import { format, compareAsc } from "date-fns";

export const formatDate = (date: string, dateFormat = "MM/dd/yyyy") => {
  return format(new Date(date), dateFormat);
};
