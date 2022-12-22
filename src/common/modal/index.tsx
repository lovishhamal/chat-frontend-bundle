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
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      title='Modal'
      open={open}
      okText='Ok'
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
