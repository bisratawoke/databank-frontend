"use client";
import { Button } from "antd";
import getBucketPublicUrl from "../../../action/getBucketPublicUrl";
import { useState, useEffect } from "react";
export default function DownloadFileButton({ fileName }: { fileName: string }) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  useEffect(() => {
    getBucketPublicUrl().then((url: any) => {
      setUrl(url);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <></>;
  } else {
    return (
      <Button
        onClick={(e) => {
          window.open(`${url}/mybucket/${fileName}`);
        }}
        type="primary"
      >
        Download
      </Button>
    );
  }
}
