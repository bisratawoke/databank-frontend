import { getRedirectUrl, payWithTelebirr } from "@/app/paymenttest/action";
import { generatePaymentInfo } from "@/app/publication/actions/generatePaymentInfo";
import { genPaymentInfoWithPublicationRequestId } from "@/app/publication/actions/genPaymentInfoWithPublicationRequestId";
import { Button } from "antd";
import { AiOutlineConsoleSql } from "react-icons/ai";
export default function Pay({
  price,
  title,
  referenceNumber,
  orderId,
  link,
  publicationRequestId,
}: {
  price: string;
  title: string;
  referenceNumber: string;
  orderId: string;
  link: string;
  publicationRequestId: string;
}) {
  function anchorOpen(link: string) {
    window.open(link);
  }
  const startPayment = async () => {
    const redirectUrl = await getRedirectUrl();
    const { message } = await genPaymentInfoWithPublicationRequestId({
      publicationRequestId,
    });

    console.log("================== publication request id ============");
    console.log(publicationRequestId);
    console.log(message._id);
    const payload = {
      bill: {
        referenceNumber: `${message._id}`,
        title: title,
        amount: `${message.price}`,
        orderId: `${message._id}`,
        timestamp: new Date().getTime(),
        // in here baby
        // redirect_url: `/paymenttest/result?link=${redirectUrl}/user/profile/dashboard&author=${message.author}&type=Link&publicationRequestId=${message._id}&`,
        redirect_url: `/paymenttest/result?link=${redirectUrl}/user/profile/dashboard&author=${message.author}&type=Link&publicationRequestId=${publicationRequestId}&`,
      },
    };
    const result = await payWithTelebirr(payload);
    anchorOpen(result.message);
  };
  return (
    <div className="flex">
      <Button
        type="primary"
        size="large"
        // className="w-[100%]"
        onClick={async () => startPayment()}
      >
        Pay
      </Button>
    </div>
  );
}
