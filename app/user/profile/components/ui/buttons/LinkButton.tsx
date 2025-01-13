import { Button } from "antd";
import { useRouter } from "next/navigation";
export type ILink = {
  href: string;
  text: string;
  startIcon: React.ReactNode;
};

export default function LinkButton(props: ILink) {
  const router = useRouter();
  return (
    <Button
      icon={props.startIcon}
      style={{
        color: "white",
        backgroundColor: "#1E50A0",
        border: "none",
      }}
      onClick={() => {
        router.push(props.href);
      }}
    >
      {props.text}
    </Button>
  );
}
