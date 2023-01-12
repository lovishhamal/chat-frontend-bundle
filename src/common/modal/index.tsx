import { Modal } from "antd";
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useState,
} from "react";
import AutoCompleteSearch from "../textSearch";

const CustomModal = ({
  title = "Modal",
  footer = true,
  open,
  setOpen,
  children,
  okText = "Create",
  cancelText = "Cancel",
}: {
  title?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  footer?: boolean;
  okText?: string;
  cancelText?: string;
}) => {
  return (
    <Modal
      title={title}
      cancelButtonProps={{ style: { display: footer ? "" : "none" } }}
      okButtonProps={{ style: { display: footer ? "" : "none" } }}
      open={open}
      okText={okText}
      cancelText={cancelText}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
