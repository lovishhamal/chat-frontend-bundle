import React, { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";

import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const { Dragger } = Upload;

const UploadPhoto = ({
  handleChange,
}: {
  handleChange: (item: any) => void;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    handleChange(newFileList[0]);
  };

  return (
    <Dragger
      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
      onChange={onChange}
    >
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>
        Click or drag file to this area to upload
      </p>
      <p className='ant-upload-hint'>
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
};

export default UploadPhoto;
