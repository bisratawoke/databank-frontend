"use client";
import { signIn } from "next-auth/react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import Link from "next/link";
const { Title } = Typography;
export default function page() {
  async function onFinish(values) {
    const res = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (res.status != 200) message.error("Invalid credentials!");
    else message.success("successfully logged");
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[25%] h-[60vh] shadow-lg rounded-lg p-6 flex flex-col justify-center">
        <div className="flex flex-col gap-1">
          <span className="text-[24px]/[14px] font-bold">Login</span>
          <span className="text-[16px]">
            Dont have an account ?<Link href="/auth/register">Register</Link>
          </span>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your username" />
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
