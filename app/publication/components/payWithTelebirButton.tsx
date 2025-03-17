import { Button } from "antd";
import { payWithTelebirr } from "../actions/payWithTelebir";
import { generatePaymentInfo } from "../actions/generatePaymentInfo";
import genUuid from "../actions/generateUuid";
import { getRedirectUrl } from "@/app/paymenttest/action";
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
    // const { message } = await generatePaymentInfo();
    const uuid = await genUuid();
    const url = await getRedirectUrl();

    console.log("============= in start payment ===========");
    console.log(uuid.split("-").join(""));

    const realId = uuid.split("-").join("");
    const payload = {
      bill: {
        referenceNumber: `${realId}`,
        title: title,
        amount: `${price}`,
        orderId: `${realId}`,
        timestamp: new Date().getTime(),
        redirect_url: `${url}/paymenttest/result?link=${link}&type=1`,
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
