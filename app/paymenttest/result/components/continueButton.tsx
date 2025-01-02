"use client";

import { Button } from "antd";

export default function ContinueButton({ link }: { link: string }) {
  return (
    <Button
      iconPosition="start"
      size="large"
      onClick={(e) => {
        window.open(`http://${link}`);
      }}
      className="w-[100%] bg-white"
    >
      Download
    </Button>
  );
}
