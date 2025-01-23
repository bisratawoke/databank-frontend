"use server";
import axios from "axios";
export type BillType = {
  referenceNumber: string;
  title: string;
  amount: string;
  orderId: string;
  timestamp: number;
};

const redirect_url = "http://localhost:3000/paymenttest/inner";

export async function payWithTelebirr(payload: { bill: BillType }) {
  const { bill } = payload;
  const investment_amount = bill.amount.split(".")[0];
  const body = {
    refNo: bill.referenceNumber,
    title: bill.title,
    total_amount: investment_amount,
    trans_currency: "ETB",
    merchant_order_id: bill.orderId,
    notify_url: redirect_url,
    redirect_url: redirect_url,
    timestamp: bill.timestamp,
  };

  try {
    const response = await axios.post(
      `${process.env.TELEBIRR_PAYMENT_GATEWAY}/create/order`,
      body
    );

    return { ok: true, message: response.data };
  } catch (error) {
    return { ok: false, message: "something went wrong" };
  }
}
