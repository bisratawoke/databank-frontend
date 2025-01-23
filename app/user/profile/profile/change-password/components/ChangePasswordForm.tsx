"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import EditUserInfo from "../../edit-profile/actions/editUserInfo";

const ChangePasswordForm = ({ data }: any) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    message.loading("loading");
    const sanitizedValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    const result = await EditUserInfo({
      payload: { password: sanitizedValues.newPassword, _id: data._id },
    });

    message.success("Succefully updated profile");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "400px", position: "relative" }}
    >
      <Form.Item name="password" label="Password">
        <Input.Password
          placeholder="Enter your password"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>

      <Form.Item name="newPassword" label="New Password">
        <Input.Password
          placeholder="Enter your new password"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>

      <Form.Item name="confirmPassword" label="Confirm Password">
        <Input.Password
          placeholder="Confirm your password"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "right", marginTop: "20px" }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            backgroundColor: "#1E50A0",
            width: "125px",
            height: "45px",
          }}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordForm;
