import { FC } from "react";

const SinglePublicationTitle: FC<{ title: string }> = ({ title }) => (
  <span className="font-bold text-[#162327] text-[38px]">{title}</span>
);

export default SinglePublicationTitle;
