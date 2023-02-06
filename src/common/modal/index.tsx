import { Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

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
    const [modal, setModal] = useState({ open: false, data: null });

    useImperativeHandle(
      ref,
      () => {
        return {
          openModal: (data: any) => setModal({ ...modal, open: true, data }),
          closeModal,
        };
      },
      []
    );

    const closeModal = (callback: () => void = () => {}) => {
      setModal({ open: false, data: null });
      callback();
    };

    return (
      <Modal
        title={title}
        cancelButtonProps={{ style: { display: footer ? "" : "none" } }}
        okButtonProps={{ style: { display: footer ? "" : "none" } }}
        open={modal.open}
        okText={okText}
        cancelText={cancelText}
        onOk={() => closeModal(onOkPress)}
        onCancel={() => closeModal(onCancelPress)}
        destroyOnClose
      >
        {children}
      </Modal>
    );
  }
);

export default CustomModal;
