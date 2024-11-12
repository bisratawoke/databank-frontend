"use client";

import React from "react";
import { Steps } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  TableOutlined,
} from "@ant-design/icons";

const StepsComponent = ({ currentStep = 0 }) => {
  const steps = [
    {
      title: "Choose Report",
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

export default StepsComponent;
