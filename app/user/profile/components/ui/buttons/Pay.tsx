import { payWithTelebirr } from "@/app/paymenttest/action";
import { generatePaymentInfo } from "@/app/publication/actions/generatePaymentInfo";
import { genPaymentInfoWithPublicationRequestId } from "@/app/publication/actions/genPaymentInfoWithPublicationRequestId";
import { Button } from "antd";
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
    const { message } = await genPaymentInfoWithPublicationRequestId({
      publicationRequestId,
    });

    const payload = {
      bill: {
        referenceNumber: `${message._id}`,
        title: title,
        amount: `${message.price}`,
        orderId: `${message._id}`,
        timestamp: new Date().getTime(),
        // in here baby
        redirect_url: `/paymenttest/result?link=http://localhost:3000/user/profile/dashboard&author=${message.author}&type=Link&publicationRequestId=${message._id}&`,
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
