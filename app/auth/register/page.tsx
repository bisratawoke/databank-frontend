"use client";
import { Form, Input, Button, Card, Typography, message } from "antd";
import Link from "next/link";
import registerUser from "../actions/registerUser";

export default function page() {
  async function onFinish(values) {
    console.log("=========== on finish =================");
    console.log(values);
    const res = await registerUser(values);
    console.log(res);
    if (res.status != 201) message.error("Something went wrong");
    else message.success("Successfully registered");
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[25%] h-[80vh] shadow-lg rounded-lg p-6 flex flex-col justify-center gap-10">
        <div className="flex flex-col gap-3">
          <span className="text-[24px]/[14px] font-bold">Register</span>
          <span className="text-[16px]">
            Already have an account ? <Link href="/api/auth/signin">Login</Link>
          </span>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please enter your company name!" },
            ]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              { required: true, message: "Please enter your mobile number!" },
            ]}
          >
            <Input placeholder="Enter your mobile number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
