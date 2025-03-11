import React from "react";
import { CircleGrid } from "./CircleGrid";

export const SignInHeader: React.FC = () => {
  return (
    <div className="flex flex-col pt-52 pr-20 pb-9 pl-4 w-full bg-blue-800 max-md:pt-24 max-md:pr-5 max-md:max-w-full">
      <div className="flex flex-col self-center max-w-full text-white w-[587px]">
        <h1 className="text-4xl font-black max-md:max-w-full">
          Welcome To ESS Data Portal
        </h1>
        <p className="self-start mt-5 text-xl font-light leading-8 text-center max-md:max-w-full">
          Unlock trusted Ethiopian statistics effortlessly. Dive into rich data
          insights for informed decision-making.
        </p>
      </div>
      <div className="flex flex-col mt-12 max-w-full w-[237px] max-md:mt-10">
        <CircleGrid />
      </div>
    </div>
  );
};
