import { LockOutlined, UserOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import FormItem from "antd/es/form/FormItem";
import { Link } from "react-router-dom";
import { uiRoutes } from "../../constants/uiRoutes";
import ImgCrop from "antd-img-crop";
import { useState } from "react";

const { Title } = Typography;

export const RegisterPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Title>Register</Title>
      <Form
        style={{ width: "20vw" }}
        name='normal_login'
        className='login-form'
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name='username'
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
          />
        </Form.Item>
        <Form.Item
          name='email'
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Email'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item
          name='confirm'
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Conffirm Password'
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Log in
          </Button>
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImgCrop rotate>
            <Upload
              action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              listType='picture-card'
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link to={uiRoutes.auth.login}>Back to login</Link>
        </div>
      </Form>
    </div>
  );
};
