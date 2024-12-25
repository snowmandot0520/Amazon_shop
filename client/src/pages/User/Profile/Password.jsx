import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { removeError, updateUser } from "../../../redux/reducers/authSlice";
import { Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const Password = () => {
  document.title = "Password Settings";

  const { updating } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const removeErrMsg = () => {
    dispatch(removeError());
  };
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
  };
  useEffect(() => {
    setClientReady(true);
  }, []);
  const {
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const submitForm = (data) => {
    dispatch(updateUser(data));
  };

  return (
    <>
      <h3 className="text-xl leading-6 font-bold text-gray-900">パスワード</h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        ここでパスワードを更新してください。
      </p>
      <hr className="border-b border-grayish-blue mt-3 mb-8" />
      <Form
        form={form}
        name="normal_login"
        className="login-form pt-5 px-6 min-w-full h-[344px]"
        initialValues={{ remember: true }}
        onChange={removeErrMsg}
        onFinish={submitForm}
      >
        <Form.Item
          name="currentPassword"
          label="現行パスワード"
          {...formItemLayout}
          rules={[
            {
              message: "現行パスワードを入力してください！",
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
          name="password"
          label="パスワード"
          {...formItemLayout}
          rules={[
            {
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
          label="パスワードの確認"
          {...formItemLayout}
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
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
            <div className="text-right">
              <Button
                className="primary w-[120px]  m-auto mb-3 mt-4"
                type="default"
                htmlType="submit"
                size="large"
                disabled={
                  updating ||
                  !clientReady ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                {updating ? (
                  <div
                    className=" spinner-border animate-spin inline-block w-4 h-4 border rounded-full"
                    role="status"
                  >
                    <span className="sr-only">ローディング中...</span>
                  </div>
                ) : (
                  <span className="text-[12px]">変更を保存</span>
                )}
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default Password;
