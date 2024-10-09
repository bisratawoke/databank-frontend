"use client";

import React, { useState } from "react";
import { Steps, Button } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  TableOutlined,
} from "@ant-design/icons";

const StepsComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);

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

  // const nextStep = () => {
  //   setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  // };

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-3 sm:px-8 lg:px-16">
      <div className="w-full max-w-4xl mb-4">
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
      {/* <Button
        type="primary"
        onClick={nextStep}
        disabled={currentStep === steps.length - 1}
      >
        Next Step
      </Button> */}
    </div>
  );
};

export default StepsComponent;
