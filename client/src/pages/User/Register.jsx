import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, removeError } from "../../redux/reducers/authSlice";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input } from "antd";

const Register = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const formItemLayout = {
    labelAlign: "left",
    labelCol: {
      xs: {
        span: 6,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 26,
      },
      sm: {
        span: 16,
      },
    },
  };
  const { loading, userInfo, error, errMsg, success } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (success) {
      navigate("/login");
    }
    if (userInfo) {
      navigate("/user-profile");
    }
  }, [navigate, userInfo, success]);

  const submitForm = (data) => {
    dispatch(registerUser(data));
  };

  const removeErrMsg = () => {
    dispatch(removeError());
  };
  useEffect(() => {
    setClientReady(true);
  }, []);

  return (
    <div className="relative h-full">
      <div className="wrapper w-full h-full  sm:py-8 flex items-center justify-center">
        <Form
          form={form}
          name="normal_login"
          className="login-form py-5 px-10  bg-white"
          initialValues={{ remember: true }}
          onChange={removeErrMsg}
          onFinish={submitForm}
        >
          <h1 className="title text-xl sm:text-2xl lg:text-3xl text-center font-bold text-very-dark-blue mb-12 mt-5">
            新 規 登 録
          </h1>
          <Form.Item
            name="username"
            label="名 前"
            {...formItemLayout}
            rules={[
              {
                type: "text",
                message: "入力された電子メールは無効です。",
              },
              {
                message: "メールアドレスを入力してください。",
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
            name="email"
            label="電子メールアドレス"
            {...formItemLayout}
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
            label="パスワード"
            {...formItemLayout}
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
          <Form.Item
            name="confirm"
            label="パスワードを認証"
            {...formItemLayout}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "パスワードを確認してください。",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("入力した新しいパスワードが一致しません。")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="business.331777"
              size="large"
            />
          </Form.Item>
          <Form.Item shouldUpdate className="w-full">
            {() => (
              <div className="text-center">
                <Button
                  className="primary w-full m-auto mb-3 mt-5"
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
                    <>登 録</>
                  )}
                </Button>
                <div className="links mt-2 flex flex-wrap w-full">
                  <span className="text-dark-grayish-blue lg:mr-4">
                    すでにアカウントをお持ちですか?
                  </span>
                  <NavLink
                    to="/login"
                    className="border-b-2 border-solid border-transparent hover:border-orange transition-color"
                    href="/"
                  >
                    ログイン
                  </NavLink>
                </div>
              </div>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
