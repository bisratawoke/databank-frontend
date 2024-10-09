import React from "react";
import FilteredReportPage from "./[filterId]/page";
import StepsComponent from "./_components/StepsCompnent/StepsCompnent";

const layout = () => {
  return (
    <>
      <StepsComponent />
      <FilteredReportPage />
    </>
  );
};

export default layout;
