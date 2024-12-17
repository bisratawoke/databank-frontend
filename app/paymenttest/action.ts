"use server";
import axios from "axios";
type BillType = {
  referenceNumber: string;
  title: string;
  amount: string;
  orderId: string;
  timestamp: number;
};

const redirect_url = "http://localhost:3000/paymenttest/inner";

export async function payWithTelebirr(payload) {
  console.log(payload);

  const { bill } = payload;
  const investment_amount = bill.amount.split(".")[0];
  const body = {
    refNo: bill.referenceNumber,
    title: bill.title,
    total_amount: investment_amount,
    trans_currency: "ETB",
    merchant_order_id: bill.orderId,
    notify_url: bill.redirect_url,
    redirect_url: redirect_url,
    timestamp: bill.timestamp,
  };

  try {
    const response = await axios.post(
      `${process.env.TELEBIRR_PAYMENT_GATEWAY}/create/order`,
      body
    );

    console.log("============== in result =================");
    console.log(response.data);

    return { ok: true, message: response.data };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "something went wrong" };
  }
}
