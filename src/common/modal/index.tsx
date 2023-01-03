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
}: {
  title?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  footer?: boolean;
}) => {
  return (
    <Modal
      title={title}
      cancelButtonProps={{ style: { display: footer ? "" : "none" } }}
      okButtonProps={{ style: { display: footer ? "" : "none" } }}
      open={open}
      okText='Create'
      cancelText='Cancel'
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
