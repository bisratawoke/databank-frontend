"use client";

import { useEffect, useState } from "react";
import SinglePublicationTitleContainer from "./singlePublicationTitleContainer";
import SinglePublicationDownloadButton from "./singlePublicationDownloadButton";
import SinglePublicationPreview from "./singlePublicationPreview";
import SinglePublicationDesciptionContainer from "./singlePublicationDescriptionContainer";
import PayWithTelebir from "./payWithTelebirButton";
import Image from "next/image";
export default function SinglePublicationView({
  publication,
}: {
  publication: Record<string, any>;
}) {
  const {
    metadata,
    permanentLink,
    fileName,
    uploadDate,
    publicationType,
    paymentRequired,
    price,
    coverImageLink,
  } = publication;

  return (
    <div className="">
      <SinglePublicationTitleContainer
        title={metadata.title}
        publishedDate={metadata.updatedAt}
        categoryName={publication.category.name}
        publicationTitle={publication.metadata.title}
      />
      <div className="grid grid-cols-12">
        <div className="col-start-3 col-end-5">
          <div className="max-w-3xl mx-auto  bg-white rounded-lg ">
            <div className="mt-6 mb-4">
              <div className="">
                {coverImageLink ? (
                  <Image
                    src={`http://${coverImageLink}`}
                    alt="something"
                    width={238}
                    height={325}
                  />
                ) : (
                  <div className="text-gray-600">
                    Preview not available for this publication.
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              {!paymentRequired ? (
                <SinglePublicationDownloadButton link={permanentLink} />
              ) : (
                <PayWithTelebir
                  price={price}
                  title={metadata.title}
                  referenceNumber={""}
                  orderId={"123"}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-start-5 col-end-11  p-6 pl-10">
          <SinglePublicationDesciptionContainer
            description={metadata.description}
          />
          {metadata.description}
        </div>
      </div>
    </div>
  );
}
