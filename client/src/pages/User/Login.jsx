import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser, removeError } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input } from "antd";
const Login = () => {
  const { loading, userInfo, error, errMsg } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  // redirect authenticated user to profile screen

  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);

  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate("/product");
    }
  }, [navigate, userInfo]);

  const submitForm = (data) => {
    dispatch(loginUser(data));
  };

  const removeErrMsg = () => {
    dispatch(removeError());
  };

  return (
    <div className="relative h-full">
      <div className="wrapper w-full h-full py-12 sm:py-8 flex items-center justify-center">
        <Form
          form={form}
          name="normal_login"
          className="login-form py-5 px-10 bg-white"
          initialValues={{ remember: true }}
          onChange={removeErrMsg}
          onFinish={submitForm}
        >
          <h1 className="title text-center text-xl sm:text-2xl lg:text-3xl font-bold text-very-dark-blue mb-20 mt-5">
            ログイン
          </h1>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "入力された電子メールは無効です。",
              },
              {
                required: true,
                message: "電子メールアドレスを入力してください。",
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              size="large"
              placeholder="business@gmail.com"
              {...register("email")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "パスワードを入力してください！",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              size="large"
              placeholder="business.331777"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <>
                <Button
                  className="primary w-full mb-3 mt-5"
                  type="default"
                  htmlType="submit"
                  size="large"
                  disabled={
                    loading ||
                    !clientReady ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                >
                  {loading ? (
                    <div
                      className=" spinner-border animate-spin inline-block w-4 h-4 border rounded-full"
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </div>
                  ) : (
                    <>ログイン</>
                  )}
                </Button>
                <div>
                  新規顧客ですか？
                  <NavLink
                    to="/register"
                    className=" text-blue-600 border-b-2 border-solid border-transparent hover:border-very-dark-blue transition-color"
                    href="/"
                  >
                    登録してください。
                  </NavLink>
                </div>
              </>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
