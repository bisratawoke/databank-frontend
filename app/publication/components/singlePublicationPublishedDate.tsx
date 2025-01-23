import formatDate from "@/lib/utils/formatDate";
import { FC } from "react";

const SinglePublicationPublishedDate: FC<{ publishedDate: string }> = ({
  publishedDate,
}: {
  publishedDate: string;
}) => {
  return (
    <div>
      <span className="text-[#0A7ACC] font-bold">Published Date:</span>{" "}
      <span className="text-[#0A7ACC]">{formatDate(publishedDate)}</span>
    </div>
  );
};

export default SinglePublicationPublishedDate;
