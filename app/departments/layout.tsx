import React from "react";
import StepsComponent from "./components/StepsCompnent/StepsCompnent";

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StepsComponent currentStep={0} />
      {children}
    </>
  );
}
