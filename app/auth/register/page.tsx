"use client";

import { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import registerUser from "../actions/registerUser";
import { UserType } from "../types/UserTypes";
import Image from "next/image";

interface RegisterFormValues {
  fullName: string;
  companyName: string;
  userType: UserType;
  email: string;
  phoneNumber: string;
  mobileNumber: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm<RegisterFormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const res = await registerUser(values);
      if (res.status === 201) {
        message.success("Successfully registered!");
        router.push("/api/auth/signin");
      } else {
        const errorMsg =
          res?.message || "Registration failed. Please try again.";
        message.error(errorMsg);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration.";

      message.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Description = () => (
    <div className="flex flex-col px-10 gap-[100px] py-[40px]">
      <div className="flex">
        <Image
          src="/images/signupLogo.png"
          width={333}
          height={67}
          alt="somrthing"
        />
      </div>
      <div className="flex flex-col text-white gap-1 max-w-[500px]">
        <span className="text-white font-bold text-[44px] text-left">
          Welcome to Ethiopian Statistics Agency Data Portal!
        </span>
        <span className="text-[16px] text-gray-400">
          Create your account to access and request official data publications.
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <div
        className="w-2/5 bg-[#1E50A0] hidden md:block"
        style={{ backgroundColor: "#1E50A0" }}
      >
        <Description />
      </div>

      <div
        className="w-3/5 bg-white flex justify-center items-center py-[40px] px-[50px]"
        style={{ backgroundColor: "white" }}
      >
        <Form<RegisterFormValues>
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className="w-full space-y-4"
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-2">
                Sign up now and start your
              </h2>
              <h2 className="text-2xl font-bold mb-2">journey with us.</h2>
            </div>
            <div className="flex flex-col">
              <span className="text-[#8D8D8D]">Already have an account?</span>

              <Link
                href="/api/auth/signin"
                className="text-blue-600 hover:underline"
              >
                Signin
              </Link>
            </div>
          </div>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                min: 2,
                message: "Full name must be at least 2 characters long",
              },
            ]}
          >
            <Input placeholder="Enter your full name" className="h-[48px]" />
          </Form.Item>

          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Enter your company name" className="h-[48px]" />
          </Form.Item>

          <Form.Item
            label="User Type"
            name="userType"
            rules={[
              {
                enum: Object.values(UserType),
                message:
                  "User type must be one of: INDIVIDUAL, COMPANY, NGO, FOREIGN_COMPANY",
              },
            ]}
          >
            <Select
              className="h-[48px]"
              size="large"
              placeholder="Select user type"
            >
              {Object.entries(UserType).map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" className="h-[48px]" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                pattern: /^[0-9]{10,14}$/,
                message: "Phone number must be 10-14 digits",
              },
            ]}
          >
            <Input placeholder="Enter your phone number" className="h-[48px]" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              {
                pattern: /^[0-9]{10,14}$/,
                message: "Mobile number must be 10-14 digits",
              },
            ]}
          >
            <Input
              placeholder="Enter your mobile number"
              className="h-[48px]"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                // No validation for password
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="h-[48px]"
            />
          </Form.Item>

          <Form.Item>
            
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-[48px] bg-[#2B5BA8]"
              loading={isLoading}
              disabled={isLoading}
              size="large"
              style={{
                backgroundColor: "#2B5BA8",
              }}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
