"use client";
import { FC } from "react";

const SinglePublicationDesciptionContainer: FC<{ description: string }> = ({
  description,
}) => (
  <div className="flex flex-col gap-2">
    <span className="font-bold text-[24px]">Description</span>
    <span className="text-[16px]">{description}</span>
  </div>
);

export default SinglePublicationDesciptionContainer;
