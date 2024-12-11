export default function DepartmentListJumbotron() {
  return (
    <div className="h-[238px] w-[100%] bg-[#E9F6FF] grid grid-cols-12">
      <div className="flex items-center col-start-3 col-end-10">
        <span>
          ESS contains detailed tables with time series. You can create your own
          selections and save these in different file formats. We also offer an
          API for ESS. Our release time for all statistics is 08:00 CET. At
          05:00 and 11:30 ESS’s metadata are updated, and the tables can be
          temporarily unavailable for up to five minutes. Published figures
          which are being revised are shown as ‘0’ or ‘.’ between 05:00 and
          08:00.
        </span>
      </div>
    </div>
  );
}
