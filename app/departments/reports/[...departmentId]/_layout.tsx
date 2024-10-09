"use client";

import React from "react";
import { Steps } from "antd"; // Import Steps from Ant Design
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import {
  CheckCircleOutlined,
  CheckOutlined,
  TableOutlined,
} from "@ant-design/icons";

const StepsComponent = ({ currentStep }) => {
  const steps = [
    {
      title: "Choose Table",
      icon: <TableOutlined />,
    },
    {
      title: "Choose Variables",
      icon: <CheckOutlined />,
    },
    {
      title: "Show Result",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div className="flex items-center justify-center py-4 sm:py-6 px-3 sm:px-8 lg:px-16">
      <div className="w-full max-w-4xl">
        <Steps current={currentStep} labelPlacement="vertical">
          {steps.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.title}
              icon={step.icon}
              style={{
                cursor: index <= currentStep ? "default" : "pointer",
                opacity: index <= currentStep ? 1 : 0.5,
              }}
            />
          ))}
        </Steps>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const router = useRouter();

  // Handle row click to increase steps and navigate
  const handleRowClick = (reportId) => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 2)); // Increase step
    router.push(`/reports/${reportId}`); // Navigate to the new report page
  };

  return (
    <div>
      <StepsComponent currentStep={currentStep} />
      <div>{children}</div> {/* Render child components */}
    </div>
  );
};

export default Layout;
