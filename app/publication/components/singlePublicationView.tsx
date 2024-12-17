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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    const mimeType = metadata.type || "";

    setFileType(fileExtension);

    const fetchFilePreview = async () => {
      try {
        const response = await fetch(`http://${permanentLink}`);
        const blob = await response.blob();

        if (mimeType.startsWith("image/")) {
          setFilePreview(URL.createObjectURL(blob));
        } else if (mimeType === "application/pdf" || fileExtension === "pdf") {
          setFilePreview(URL.createObjectURL(blob));
        } else if (mimeType.startsWith("text/") || fileExtension === "txt") {
          const text = await blob.text();
          setFilePreview(text);
        } else {
          setFilePreview(null);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFilePreview();
  }, [permanentLink, fileName, metadata.type]);

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
                {filePreview ? (
                  coverImageLink ? (
                    <Image
                      src={`http://${coverImageLink}`}
                      alt="something"
                      width={238}
                      height={500}
                    />
                  ) : (
                    <div className="text-gray-600">
                      Preview not available for this file type.
                    </div>
                  )
                ) : (
                  <div className="text-gray-600">
                    Preview not available for this file.
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
