import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";
import { uiRoutes } from "../../constants/uiRoutes";
import { loginService } from "../../services/auth";

const { Title } = Typography;

export const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    loginService(values).then((data: any) => {
      navigate(uiRoutes.dashboard);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Title>Login</Title>
      <Form
        style={{ width: "20vw" }}
        name='normal_login'
        className='login-form'
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name='userName'
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
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
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className='login-form-forgot' href=''>
            Forgot password
          </a>
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
        <FormItem
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          Or
        </FormItem>
        <Form.Item>
          <Button
            onClick={() => navigate(uiRoutes.auth.register)}
            style={{ width: "100%" }}
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
