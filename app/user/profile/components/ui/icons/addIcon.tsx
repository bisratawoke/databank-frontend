import AddIconImage from "@/public/assets/icons/add.png";
import Image from "next/image";

export default function AddIcon() {
  return (
    <Image src={AddIconImage} alt="new request button" width={23} height={23} />
  );
}
