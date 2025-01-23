import { Button } from "antd";
import { payWithTelebirr } from "../actions/payWithTelebir";
import { generatePaymentInfo } from "../actions/generatePaymentInfo";
export default function PayWithTelebir({
  price,
  title,
  referenceNumber,
  orderId,
  link,
}: {
  price: string;
  title: string;
  referenceNumber: string;
  orderId: string;
  link: string;
}) {
  function anchorOpen(link: string) {
    window.open(link);
  }
  const startPayment = async () => {
    const { message } = await generatePaymentInfo();

    const payload = {
      bill: {
        referenceNumber: `${Math.floor(Math.random())}`,
        title: title,
        amount: `${price}`,
        orderId: String(Math.floor(Math.random())),
        timestamp: new Date().getTime(),
        redirect_url: `http://localhost:3000/paymenttest/resut?link=${link}`,
      },
    };
    const result = await payWithTelebirr(payload);
    anchorOpen(result.message);
  };
  return (
    <Button
      type="primary"
      size="large"
      className="w-[100%]"
      onClick={async () => startPayment()}
    >
      Buy Now
    </Button>
  );
}
