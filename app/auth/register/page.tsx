"use client";

import { useState } from "react";
import { Form, Input, Button, message, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import registerUser from "../actions/registerUser";
import { UserType } from "../types/UserTypes";
import Image from "next/image";
import { BACKEND_URL } from "@/constants/constants";

interface RegisterFormValues {
  fullName: string;
  companyName?: string;
  userType: UserType;
  email: string;
  phoneNumber: string;
  mobileNumber: string;
  password: string;
  country?: string;
  authorizationLetter?: any;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm<RegisterFormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "authorizationLetter" && value) {
          formData.append("authorizationLetter", value[0].originFileObj);
        } else {
          formData.append(key, value as string);
        }
      });

      const res = await fetch(`${BACKEND_URL}/portal-users/register`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.status === 201) {
        message.success("Successfully registered!");
        router.push("/api/auth/signin");
      } else {
        message.error(
          result?.message || "Registration failed. Please try again."
        );
      }
    } catch (error: unknown) {
      message.error("An unexpected error occurred during registration.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const onFinish = async (values: RegisterFormValues) => {
  //   setIsLoading(true);
  //   try {
  //     // The file upload is handled by the form.
  //     // Ensure that if a file is provided, you extract the file object to send to your API.
  //     // For example, you might extract it like this:
  //     // const file = values.authorizationLetter && values.authorizationLetter[0];
  //     console.log(values);
  //     const res = await registerUser(values);
  //     if (res.status === 201) {
  //       message.success("Successfully registered!");
  //       router.push("/api/auth/signin");
  //     } else {
  //       const errorMsg =
  //         res?.message || "Registration failed. Please try again.";
  //       message.error(errorMsg);
  //     }
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : "An unexpected error occurred during registration.";
  //     message.error(errorMessage);
  //     console.error("Registration error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const Description = () => (
    <div className="flex flex-col items-center justify-center h-full px-10 gap-8">
      <div className="flex justify-center">
        <Image
          src="/images/signupLogo.png"
          width={333}
          height={67}
          alt="Ethiopian Statistical Service Logo"
        />
      </div>
      <div className="flex flex-col text-white gap-4 text-center">
        <span className="text-white font-bold text-3xl">
          Welcome to Ethiopian <br />
          Statistics Agency Data Portal!
        </span>
        <span className="text-white text-sm">
          Create your account to access and request official data publications.
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-[100vh] flex">
      {/* Left Half - Blue Background with Description (1/3 width) */}
      <div className="hidden md:flex md:w-1/3 bg-[#1E50A0] items-center justify-center p-8">
        <Description />
      </div>

      {/* Right Half - Registration Form (2/3 width) */}
      <div className="w-1/2 md:w-2/3 flex items-center justify-center mt-4 p-8 bg-gray-50">
        <div className="bg-white border border-gray-200 p-8 rounded-lg w-full md:w-1/2">
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="justify-between gap-2">
                <span className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    Sign up now and start your
                  </h2>
                </span>
                <h2 className="text-xl font-bold">journey with us.</h2>
              </div>
              <div className="text-right">
                <span className="text-[#8D8D8D]">Already have an account?</span>
                <Link
                  href="/api/auth/signin"
                  className="text-blue-600 hover:underline block"
                >
                  Sign in
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
              <Input placeholder="Enter your full name" className="h-12" />
            </Form.Item>

            {/* User Type Field */}
            <Form.Item
              label="User Type"
              name="userType"
              rules={[{ required: true, message: "Please select a user type" }]}
            >
              <Select
                className="h-12"
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

            {/* Conditionally show Company Name, Country and Authorization Letter */}
            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.userType !== currentValues.userType
              }
              noStyle
            >
              {({ getFieldValue }) => {
                const userType = getFieldValue("userType");
                return userType && userType !== UserType.INDIVIDUAL ? (
                  <>
                    <Form.Item
                      label="Company Name"
                      name="companyName"
                      rules={[{ whitespace: true }]}
                    >
                      <Input
                        placeholder="Enter your company name"
                        className="h-12"
                      />
                    </Form.Item>
                    {userType === UserType.FOREIGN_COMPANY && (
                      <Form.Item
                        label="Country"
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your country",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter your country"
                          className="h-12"
                        />
                      </Form.Item>
                    )}
                    <Form.Item
                      name="authorizationLetter"
                      label="Authorization Letter"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please upload your authorization letter.",
                        },
                      ]}
                    >
                      <Upload.Dragger
                        name="authorizationLetter"
                        beforeUpload={() => false} // Prevent auto upload
                        accept=".pdf,.doc,.docx"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Support for PDF, DOC, DOCX files only, max 5MB.
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" className="h-12" />
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
              <Input placeholder="Enter your phone number" className="h-12" />
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
              <Input placeholder="Enter your mobile number" className="h-12" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                className="h-12"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-[#1E50A0]"
                loading={isLoading}
                disabled={isLoading}
                size="large"
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
