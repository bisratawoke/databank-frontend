"use client";
import { payWithTelebirr } from "./action";

export default function paytest() {
  function anchorOpen(link: string) {
    window.open(link);
  }
  const startPayment = async () => {
    const payload = {
      bill: {
        referenceNumber: `${Math.floor(Math.random())}`,
        title: "This is a ttest",
        amount: "12",
        orderId: "123",
        timestamp: new Date().getTime(),
        redirect_url: "http://localhost:3000/paymenttest/inner",
      },
    };
    const result = await payWithTelebirr(payload);

    anchorOpen(result.message);
  };
  return <button onClick={async () => await startPayment()}>paybaby</button>;
}
