import React from "react";

function InfoSection() {
  return (
    <div className="bg-lightbluebackground p-4 sm:p-5 lg:px-[14%] md:px-[15%] rounded">
      <div className="flex flex-col lg:flex-row justify-between max-w-full lg:max-w-[67rem] mx-auto mt-6 sm:mt-8">
        {/* Left Section - Texts justified */}
        <div className="flex-1 lg:w-[50%] h-auto lg:h-[9.75rem] mb-4 lg:mb-0 text-left mr-8">
          <p className="text-sm sm:text-base text-justify leading-relaxed">
            ESS contains detailed tables with time series. You can create your
            own selections and save these in different file formats. We also
            offer an API for ESS.
          </p>
          <p className="text-sm sm:text-base text-justify leading-relaxed">
            Our release time for all statistics is 08:00 CET.
          </p>
          <p className="text-sm sm:text-base text-justify leading-relaxed">
            At 05:00 and 11:30 ESS’s metadata are updated, and the tables can be
            temporarily unavailable for up to five minutes. Published figures
            which are being revised are shown as ‘0’ or ‘.’ between 05:00 and
            08:00.
          </p>
        </div>
        {/* Right Section - Links aligned left */}
        <div className="flex flex-col lg:w-[11.8125rem] h-auto lg:h-[5.5625rem] text-left">
          <a
            href="#"
            className="block mb-2 text-sm sm:text-base text-[#224986] underline decoration-[#224986] hover:text-[#BB9271]"
          >
            How to use ESS Ethiopia
          </a>
          <a
            href="#"
            className="block mb-2 text-sm sm:text-base text-[#224986] underline decoration-[#224986] hover:text-[#BB9271]"
          >
            Changes to tables in ESS
          </a>
          <a
            href="#"
            className="block mb-2 text-sm sm:text-base text-[#224986] underline decoration-[#224986] hover:text-[#BB9271]"
          >
            Public APIs
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
