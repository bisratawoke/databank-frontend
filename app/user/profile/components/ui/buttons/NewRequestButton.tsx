import { Button } from "antd";
import AddIcon from "../icons/addIcon";
import { useRouter } from "next/navigation";
export default function NewRequestButton() {
  const router = useRouter();
  return (
    <Button
      style={{
        backgroundColor: "#1E50A0",
        color: "white",
        width: "176px",
        height: "45px",
      }}
      icon={<AddIcon />}
      // size="large"
      onClick={() => router.push("/publication-request/post")}
    >
      {" "}
      New Request
    </Button>
  );
}
