import React from "react";
import ReportPage from "./reports/[...departmentId]/page";
import StepsComponent from "./_components/StepsCompnent/StepsCompnent";

const layout = () => {
  return (
    <>
      <StepsComponent />
      <ReportPage />
    </>
  );
};

export default layout;
