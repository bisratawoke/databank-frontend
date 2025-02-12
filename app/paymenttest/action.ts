"use server";
import axios from "axios";
import { getSession } from "@/lib/auth";
import { BACKEND_URL } from "@/constants/constants";
type BillType = {
  referenceNumber: string;
  title: string;
  amount: string;
  orderId: string;
  timestamp: number;
};

export async function payWithTelebirr(payload: any) {
  const { bill } = payload;
  const investment_amount = bill.amount.split(".")[0];
  const body = {
    refNo: bill.referenceNumber,
    title: bill.title,
    total_amount: investment_amount,
    trans_currency: "ETB",
    merchant_order_id: bill.orderId,
    notify_url: bill.redirect_url,
    redirect_url: bill.redirect_url,
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

export async function UpdatedPublicationRequestPaymentStatus({
  payload,
  publicationRequestId,
}: any) {
  try {
    const session: any = await getSession();

    const response = await axios.put(
      `${BACKEND_URL}/publication-payments/${publicationRequestId}`,
      payload
    );

    return { ok: true, message: response.data };
  } catch (error) {
    return { ok: false, message: "something went wrong" };
  }
}
