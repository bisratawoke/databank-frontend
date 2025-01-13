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
    <div className="h-screen w-full relative">
      {/* Top half */}
      <div
        className="absolute top-0 left-0 w-full h-1/2"
        style={{ backgroundColor: "#1E50A0" }}
      ></div>

      {/* Bottom half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>

      {/* Centered Form */}
      <div className="absolute inset-0 flex justify-center items-center">
        <Card
          className="shadow-lg rounded-lg p-6"
          style={{
            width: "100%",
            maxWidth: "400px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="mb-6 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[12px]">Welcome to ESS</span>
              <span className="text-[16px] font-bold">Sign in</span>
            </div>
            <div className="flex flex-col">
              <span>No Account?</span>
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Signup
              </Link>
            </div>
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
            <Form.Item label="Email or Username" name="username">
              <Input
                placeholder="Enter your email or username"
                className="h-10"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password
                placeholder="Enter your password"
                className="h-10"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-10"
                loading={isLoading}
                disabled={isLoading}
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* <div className="mt-4 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div> */}
        </Card>
      </div>
    </div>
  );
}
