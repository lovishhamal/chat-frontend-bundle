import { notification } from "antd";
import { toCapitalize } from "../../util/common";
type NotificationType = "success" | "info" | "warning" | "error";

const showNotification = ({
  type,
  message,
}: {
  type: NotificationType;
  message: string;
}) => {
  notification.open({
    type: type,
    message: toCapitalize(type),
    description: message,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

export default showNotification;
