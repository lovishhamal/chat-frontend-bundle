import { Modal } from "antd";
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useState,
} from "react";

const CustomModal = forwardRef(
  (
    {
      title = "Modal",
      footer = true,
      children,
      okText = "Create",
      cancelText = "Cancel",
      onOkPress = () => {},
      onCancelPress = () => {},
    }: {
      title?: string;
      children: React.ReactNode;
      footer?: boolean;
      okText?: string;
      cancelText?: string;
      onOkPress?: () => void;
      onCancelPress?: () => void;
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    useImperativeHandle(
      ref,
      () => {
        return {
          openModal: () => setOpen(true),
          closeModal: () => setOpen(false),
        };
      },
      []
    );

    return (
      <Modal
        title={title}
        cancelButtonProps={{ style: { display: footer ? "" : "none" } }}
        okButtonProps={{ style: { display: footer ? "" : "none" } }}
        open={open}
        okText={okText}
        cancelText={cancelText}
        onOk={() => {
          setOpen(false);
          onOkPress();
        }}
        onCancel={() => {
          setOpen(false);
          onCancelPress();
        }}
        destroyOnClose
      >
        {children}
      </Modal>
    );
  }
);

export default CustomModal;
