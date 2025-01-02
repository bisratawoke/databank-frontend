import TIckIcon from "@/public/images/tickIcon.svg";
import Image from "next/image";
import ContinueButton from "./continueButton";

export default function PaymentSucessfullNotification({
  link,
}: {
  link: string;
}) {
  return (
    <div className="rounded-md w-[576px] min-h-[429px] bg-[#2B5BA8] flex flex-col items-center justify-center gap-5">
      <Image src={TIckIcon} width={52} height={52} alt="sucessicon" />

      <div className="flex flex-col gap-2 items-center">
        <span className="text-white text-[24px] font-bold">
          Your payment is Paid
        </span>
        <span className="text-white text-[18px]">
          Your Payment Has Been Successfully Completed
        </span>
      </div>
      <div className="flex items-center">
        <ContinueButton link={link} />
      </div>
    </div>
  );
}
