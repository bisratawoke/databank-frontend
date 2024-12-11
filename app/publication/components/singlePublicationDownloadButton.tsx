import { Button } from "antd";
import { FC } from "react";
import { BiDownArrow } from "react-icons/bi";
import { FcDown } from "react-icons/fc";
import { LuDownload } from "react-icons/lu";

const SinglePublicationDownloadButton: FC<{ link: string }> = ({ link }) => {
  return (
    <Button
      icon={<LuDownload />}
      iconPosition="start"
      type="primary"
      size="large"
      onClick={(e) => {
        window.open(`http://${link}`);
      }}
    >
      Download Full Report
    </Button>
  );
};

export default SinglePublicationDownloadButton;
