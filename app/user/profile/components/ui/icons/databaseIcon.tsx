import databaseIconImage from "@/public/assets/icons/database.png";
import Image from "next/image";

export default function databaseIcon() {
  return (
    <Image src={databaseIconImage} alt="database icon" width={20} height={20} />
  );
}
