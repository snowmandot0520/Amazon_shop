import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { removeError, updateQoo10 } from "../../../redux/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import {
  cancelUpdate,
  enableUpdate,
  updateUser,
} from "../../../redux/reducers/authSlice";

const Qoo10 = () => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelAlign: "left",
    labelCol: {
      xs: {
        span: 8,
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
        span: 18,
      },
    },
  };
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { userInfo, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { reset } = useForm();
  const removeErrMsg = () => {
    dispatch(removeError());
  };
  useEffect(() => {
    dispatch(cancel);
  }, []);

  const cancel = () => {
    document.title = "Profile Qoo10";

    reset({
      username: userInfo.username,
      phone: userInfo.phone || "",
      email: userInfo.email,
      gender: userInfo.gender || "",
    });
    dispatch(cancelUpdate());
  };

  const submitForm = (data) => {
    dispatch(updateQoo10(data));
  };

  return (
    <>
      <h3 className="text-xl leading-6 font-bold text-gray-900">
        shopeeアカウント管理
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        ここでshopeeアカウント情報を更新してください。
      </p>
      <hr className="border-b border-grayish-blue mt-3 mb-8" />

      <Form
        form={form}
        name="normal_login"
        className="login-form pt-5 text-left px-6 min-w-full h-[344px]"
        initialValues={{ remember: true }}
        onChange={removeErrMsg}
        onFinish={submitForm}
      >
        <Form.Item hidden name="_id" initialValue={userInfo?._id} required>
          <Input hidden value={userInfo?._id}></Input>
        </Form.Item>
        <Form.Item
          name="API_KEY"
          label="API_KEY"
          {...formItemLayout}
          rules={[
            {
              type: "text",
              message: "入力されたAPI_KEYは無効です。",
            },
            {
              message: "API_KEYを入力してください。",
            },
          ]}
          hasFeedback
        >
          <Input
            defaultValue={userInfo.API_KEY}
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
            {...register("email")}
          />
        </Form.Item>
        <Form.Item
          name="USER_ID"
          label="USER_ID"
          {...formItemLayout}
          rules={[
            {
              type: "text",
              message: "入力されたUSER_IDは無効です。",
            },
            {
              message: "USER_IDを入力してください。",
            },
          ]}
          hasFeedback
        >
          <Input
            defaultValue={userInfo.USER_ID}
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
            {...register("email")}
          />
        </Form.Item>
        <Form.Item
          name="USER_PASSWORD"
          label="USER_PASSWORD"
          {...formItemLayout}
          rules={[
            {
              type: "text",
              message: "入力されたUSER_PASSWORDは無効です。",
            },
            {
              message: "USER_PASSWORDを入力してください。",
            },
          ]}
          hasFeedback
        >
          <Input
            defaultValue={userInfo.USER_PASSWORD}
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
            {...register("email")}
          />
        </Form.Item>

        <Form.Item shouldUpdate className="w-full">
          {() => (
            <div className="text-right">
              <Button
                className="primary w-[120px]  m-auto mb-3 mt-3"
                type="default"
                htmlType="submit"
                size="large"
                disabled={
                  loading ||
                  // !clientReady ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                {loading ? (
                  <div
                    className=" spinner-border animate-spin inline-block w-4 h-4 border rounded-full"
                    role="status"
                  >
                    <span className="sr-only">ローディング中...</span>
                  </div>
                ) : (
                  <span className="text-[12px]">更新</span>
                )}
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default Qoo10;
