import SinglePublicationTitle from "./singlePublicationTitle";

export default function SinglePublicationTitleContainer({
  title,
  publisedDate,
}: {
  title: string;
  publisedDate: string;
}) {
  return (
    <div className="h-[238px] w-[100%] bg-[#E9F6FF] grid grid-cols-12">
      <div className="col-start-3 col-end-10 flex items-center">
        <SinglePublicationTitle title={title} />
      </div>
    </div>
  );
}
