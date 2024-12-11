import { FC } from "react";

const SinglePublicationBreadcrumb: FC<{
  categoryName: string;
  publicationTitle: string;
}> = ({ categoryName, publicationTitle }) => (
  <div>
    <span className="text-[16px] font-bold">Home / </span>
    <span className="text-[16px] font-bold">{categoryName} / </span>
    <span className="text-[16px] font-bold">{publicationTitle}</span>
  </div>
);

export default SinglePublicationBreadcrumb;