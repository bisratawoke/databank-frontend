"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import EditUserInfo from "../edit-profile/actions/editUserInfo";

const { Option } = Select;

const EditUserForm = ({ data }: any) => {
  const [form] = Form.useForm();
  const [profileInfo, setProfileInfo] = useState(data);

  // Set form initial values when profileInfo changes
  useEffect(() => {
    form.setFieldsValue(profileInfo);
  }, [profileInfo, form]);

  const onFinish = async (values: any) => {
    message.loading("loading");
    const sanitizedValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    console.log("Sanitized Form Values:", sanitizedValues);
    const result = await EditUserInfo({
      payload: { ...sanitizedValues, _id: profileInfo._id },
    });
    console.log(result);
    message.success("Succefully updated profile");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "800px", position: "relative" }}
      initialValues={profileInfo}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="userType"
            label={<span style={{ fontSize: "16px" }}>User Type</span>}
          >
            <Select
              placeholder="Select user type"
              size="large"
              style={{ height: "48px" }}
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="country"
            label={<span style={{ fontSize: "16px" }}>Country</span>}
          >
            <Input
              placeholder="Enter country"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fullName"
            label={<span style={{ fontSize: "16px" }}>Full Name</span>}
          >
            <Input
              placeholder="Enter full name"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label={<span style={{ fontSize: "16px" }}>Email</span>}
          >
            <Input
              placeholder="Enter email"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phoneNumber"
            label={<span style={{ fontSize: "16px" }}>Phone Number</span>}
          >
            <Input
              placeholder="Enter phone number"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="organizationType"
            label={<span style={{ fontSize: "16px" }}>Organization Type</span>}
          >
            <Select
              placeholder="Select organization type"
              size="large"
              style={{ height: "48px" }}
            >
              <Option value="corporate">Corporate</Option>
              <Option value="nonProfit">Non-Profit</Option>
              <Option value="government">Government</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="position"
            label={<span style={{ fontSize: "16px" }}>Position</span>}
          >
            <Input
              placeholder="Enter position"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="organizationName"
            label={<span style={{ fontSize: "16px" }}>Organization Name</span>}
          >
            <Input
              placeholder="Enter organization name"
              size="large"
              style={{ height: "48px" }}
            />
          </Form.Item>
        </Col>
      </Row>
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

export default EditUserForm;
