"use client";
import { Button } from "antd";
export default function DownloadFileButton({ fileName }: { fileName: string }) {
  return (
    <Button
      onClick={(e) => {
        window.open(`http://localhost:9000/mybucket/${fileName}`);
      }}
      type="primary"
    >
      Download
    </Button>
  );
}
