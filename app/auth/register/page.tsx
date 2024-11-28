// "use client";
// import { Form, Input, Button, Card, Typography, message } from "antd";
// import Link from "next/link";
// import registerUser from "../actions/registerUser";

// export default function page() {
//   async function onFinish(values) {
//     console.log("=========== on finish =================");
//     console.log(values);
//     const res = await registerUser(values);
//     console.log(res);
//     if (res.status != 201) message.error("Something went wrong");
//     else message.success("Successfully registered");
//   }
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <Card className="w-[25%] h-[80vh] shadow-lg rounded-lg p-6 flex flex-col justify-center gap-10">
//         <div className="flex flex-col gap-3">
//           <span className="text-[24px]/[14px] font-bold">Register</span>
//           <span className="text-[16px]">
//             Already have an account ? <Link href="/api/auth/signin">Login</Link>
//           </span>
//         </div>
//         <Form
//           name="login"
//           onFinish={onFinish}
//           layout="vertical"
//           className="space-y-4"
//         >
//           <Form.Item
//             label="Full Name"
//             name="fullName"
//             rules={[
//               { required: true, message: "Please enter your full name!" },
//             ]}
//           >
//             <Input placeholder="Enter your full name" />
//           </Form.Item>

//           <Form.Item
//             label="Company Name"
//             name="companyName"
//             rules={[
//               { required: true, message: "Please enter your company name!" },
//             ]}
//           >
//             <Input placeholder="Enter your company name" />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               {
//                 required: true,
//                 type: "email",
//                 message: "Please enter a valid email!",
//               },
//             ]}
//           >
//             <Input placeholder="Enter your email" />
//           </Form.Item>

//           <Form.Item
//             label="Phone Number"
//             name="phoneNumber"
//             rules={[
//               { required: true, message: "Please enter your phone number!" },
//             ]}
//           >
//             <Input placeholder="Enter your phone number" />
//           </Form.Item>

//           <Form.Item
//             label="Mobile Number"
//             name="mobileNumber"
//             rules={[
//               { required: true, message: "Please enter your mobile number!" },
//             ]}
//           >
//             <Input placeholder="Enter your mobile number" />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter your password!" }]}
//           >
//             <Input.Password placeholder="Enter your password" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" className="w-full">
//               Register
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import registerUser from "../actions/registerUser";
import { UserType } from "../types/UserTypes";

// Define the shape of registration form values
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
      console.log("Registration values:", values);

      const res = await registerUser(values);

      console.log("Registration response:", res);

      if (res.status === 201) {
        message.success("Successfully registered!");

        // Optional: Redirect to login or dashboard
        router.push("/api/auth/signin");
      } else {
        // Use the message from the response if available
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Register</h2>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/api/auth/signin"
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <Form<RegisterFormValues>
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter your full name!",
                whitespace: true,
              },
              {
                min: 2,
                message: "Full name must be at least 2 characters long",
              },
            ]}
          >
            <Input placeholder="Enter your full name" className="h-10" />
          </Form.Item>

          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              {
                required: true,
                message: "Please enter your company name!",
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Enter your company name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="User Type"
            name="userType"
            rules={[
              {
                required: true,
                message: "Please select your user type!",
              },
              {
                enum: Object.values(UserType),
                message:
                  "User type must be one of: INDIVIDUAL, COMPANY, NGO, FOREIGN_COMPANY",
              },
            ]}
          >
            <Select>
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
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" className="h-10" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please enter your phone number!",
              },
              {
                pattern: /^[0-9]{10,14}$/,
                message: "Phone number must be 10-14 digits",
              },
            ]}
          >
            <Input placeholder="Enter your phone number" className="h-10" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              {
                required: true,
                message: "Please enter your mobile number!",
              },
              {
                pattern: /^[0-9]{10,14}$/,
                message: "Mobile number must be 10-14 digits",
              },
            ]}
          >
            <Input placeholder="Enter your mobile number" className="h-10" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
              // {
              //   min: 8,
              //   message: "Password must be at least 8 characters long",
              // },
              // {
              //   pattern:
              //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              //   message:
              //     "Password must include uppercase, lowercase, number, and special character",
              // },
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
