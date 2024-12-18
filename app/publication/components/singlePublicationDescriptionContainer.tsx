"use client";
import { FC } from "react";

const SinglePublicationDesciptionContainer: FC<{ description: string }> = ({
  description,
}) => (
  <div className="flex flex-col gap-2">
    <span className="font-bold text-[24px]">Description</span>
    <div className="flex flex-wrap overflow-hidden">
      <span className="text-[16px] flex flex-wrap overflow-hidden break-words">
        {description}
      </span>
    </div>
  </div>
);

export default SinglePublicationDesciptionContainer;
