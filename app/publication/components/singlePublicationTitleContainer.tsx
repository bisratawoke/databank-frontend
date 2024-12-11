import SinglePublicationBreadcrumb from "./singlePublicationBreadcrumb";
import SinglePublicationPublishedDate from "./singlePublicationPublishedDate";
import SinglePublicationTitle from "./singlePublicationTitle";

export default function SinglePublicationTitleContainer({
  title,
  publishedDate,
  categoryName,
  publicationTitle,
}: {
  title: string;
  publishedDate: string;
  categoryName: string;
  publicationTitle: string;
}) {
  return (
    <div className="h-[238px] w-[100%] bg-[#E9F6FF] grid grid-cols-12">
      <div className="col-start-3 col-end-10 flex items-center">
        <div className="flex flex-col gap-5">
          <SinglePublicationBreadcrumb
            categoryName={categoryName}
            publicationTitle={publicationTitle}
          />
          <div className="flex flex-col gap-1">
            <SinglePublicationTitle title={title} />
            <SinglePublicationPublishedDate publishedDate={publishedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
