import { Button } from "antd";
import { payWithTelebirr } from "../actions/payWithTelebir";

export default function PayWithTelebir({
  price,
  title,
  referenceNumber,
  orderId,
}: {
  price: string;
  title: string;
  referenceNumber: string;
  orderId: string;
}) {
  function anchorOpen(link: string) {
    window.open(link);
  }
  const startPayment = async () => {
    const payload = {
      bill: {
        referenceNumber: `${new Date().getTime()}`,
        title: title,
        amount: `${price}`,
        orderId: orderId,
        timestamp: new Date().getTime(),
        redirect_url: "http://localhost:3000/paymenttest/inner",
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
