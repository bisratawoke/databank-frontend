"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Form, Input, Button, Card, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function SigninPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      // Detailed error handling
      if (res?.error) {
        const errorMsg =
          res.error === "CredentialsSignin"
            ? "Invalid username or password"
            : res.error;

        setErrorMessage(errorMsg);
        message.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // Successful login
      message.success("Successfully logged in!");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      setErrorMessage(errorMessage);
      message.error(errorMessage);
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <Form<LoginFormValues>
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label="Email or Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your email or username!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email or username"
              className="h-10"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="h-10"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10"
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-center">
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </Card>
    </div>
  );
}
