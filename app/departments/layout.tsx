import React from "react";
import ReportPage from "./reports/[...departmentId]/page";
import StepsComponent from "./components/StepsCompnent/StepsCompnent";

const layout = () => {
  return (
    <>
      <StepsComponent currentStep={0} />

      <ReportPage />
    </>
  );
};

export default layout;
