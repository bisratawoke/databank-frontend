"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, FC } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SinglePublicationPreview: FC<{ link: string }> = ({ link }) => {
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = () => {
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
      {loading && <p className="text-gray-500">Loading PDF...</p>}
      {/* <iframe
        src={link}
        width="100%"
        height="500px"
        className="border rounded-md"
      /> */}
      {/* <Document
        file={link}
        // onLoadSuccess={onDocumentLoadSuccess}
        // className={loading ? "hidden" : ""}
      >
        <Page pageNumber={1} />
      </Document> */}
    </div>
  );
};

export default SinglePublicationPreview;
