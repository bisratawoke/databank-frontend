"use client";

import { useEffect, useState } from "react";

export default function SinglePublicationView({
  publication,
}: {
  publication: Record<string, any>;
}) {
  const { metadata, permanentLink, fileName, uploadDate, publicationType } =
    publication;
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    // Get the file extension or type
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    const mimeType = metadata.type || ""; // MIME type could be provided

    setFileType(fileExtension);

    const fetchFilePreview = async () => {
      try {
        const response = await fetch(`http://${permanentLink}`);
        const blob = await response.blob();

        // Handle image files
        if (mimeType.startsWith("image/")) {
          setFilePreview(URL.createObjectURL(blob));
        }
        // Handle PDF files
        else if (mimeType === "application/pdf" || fileExtension === "pdf") {
          setFilePreview(URL.createObjectURL(blob));
        }
        // Handle text files (show contents)
        else if (mimeType.startsWith("text/") || fileExtension === "txt") {
          const text = await blob.text();
          setFilePreview(text);
        }
        // For other file types, show a generic icon or message
        else {
          setFilePreview(null);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFilePreview();
  }, [permanentLink, fileName, metadata.type]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title Field */}
      <div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 mt-2">
          {metadata.title}
        </h1>
      </div>

      {/* File Preview */}
      <div className="mt-6 mb-4">
        <strong className="block text-lg font-medium text-gray-700">
          File Preview:
        </strong>
        <div className="mt-2 p-4 bg-gray-100 rounded-lg border border-gray-300">
          {filePreview ? (
            // If it's an image or PDF, render it
            fileType.startsWith("image/") ? (
              <img
                src={filePreview}
                alt={fileName}
                className="max-w-full h-auto rounded-lg"
              />
            ) : fileType === "pdf" || metadata.type === "application/pdf" ? (
              <iframe
                src={filePreview}
                width="100%"
                height="500px"
                className="border-0 rounded-lg"
                title="PDF Preview"
              ></iframe>
            ) : typeof filePreview === "string" ? (
              // If it's a text file, show the contents
              <pre className="whitespace-pre-wrap text-gray-600">
                {filePreview}
              </pre>
            ) : (
              // For unsupported file types, show a generic message or icon
              <div className="text-gray-600">
                Preview not available for this file type.
              </div>
            )
          ) : (
            // Fallback message if no preview is available
            <div className="text-gray-600">
              Preview not available for this file.
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-lg text-gray-600 mt-4">{metadata.description}</p>

      <div className="mt-8 space-y-4">
        {/* File Name */}
        <div>
          <strong className="block text-lg font-medium text-gray-700">
            File Name:
          </strong>
          <p className="text-gray-600">{fileName}</p>
        </div>

        {/* Upload Date */}
        <div>
          <strong className="block text-lg font-medium text-gray-700">
            Uploaded On:
          </strong>
          <p className="text-gray-600">
            {new Date(uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Buttons based on publication type */}
      <div className="mt-8">
        {publicationType === "PUBLIC" ? (
          <a
            href={`http://${permanentLink}`}
            download={fileName}
            className="inline-block px-4 py-2 bg-green-500 text-white font-medium text-sm rounded-md shadow-sm hover:bg-green-600 transition-colors duration-300"
          >
            Download
          </a>
        ) : publicationType === "FOR_SALE" ? (
          <a
            href="/publication-request/post"
            className="inline-block px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
          >
            Pay Now
          </a>
        ) : null}
      </div>
    </div>
  );
}
