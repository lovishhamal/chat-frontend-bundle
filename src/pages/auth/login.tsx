import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SET_LOGGED_IN_USER } from "../../constants/actions";
import { uiRoutes } from "../../constants/uiRoutes";
import { AuthContext } from "../../context";
import { loginService } from "../../services/auth";
import { LocalStorage } from "../../util/localStorage";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext<any>(AuthContext);

  const onFinish = (values: any) => {
    loginService(values).then((data: any) => {
      LocalStorage.setLocalStorage("user", data.data);
      dispatch({ type: SET_LOGGED_IN_USER, payload: data.data });
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

export default LoginPage;
