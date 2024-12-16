import React from "react";

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <StepsComponent currentStep={0} /> */}
      {children}
    </>
  );
}
