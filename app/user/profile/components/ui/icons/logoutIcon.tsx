import Image from "next/image";
import logoutIconImage from "@/public/assets/icons/logout.png";

export default function LogoutIcon() {
  return <Image src={logoutIconImage} width={17} height={15} alt="" />;
}
