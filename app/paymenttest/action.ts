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

export async function getRedirectUrl() {
  return process.env.PAYMENT_REDIRECT_URL;
}
export async function payWithTelebirr(payload: any) {
  const { bill } = payload;
  const investment_amount = bill.amount.split(".")[0];
  const body = {
    refNo: bill.referenceNumber,
    title: bill.title,
    total_amount: investment_amount,
    trans_currency: "ETB",
    merchant_order_id: bill.orderId,
    notify_url: `${process.env.PAYMENT_REDIRECT_URL}${bill.redirect_url}`,
    redirect_url: `${process.env.PAYMENT_REDIRECT_URL}${bill.redirect_url}`,
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

// export default async function sendEmail({ link }: { link: string }) {
//   try {
//     const session: any = await getSession();
//     const recipient = session.user.email;
//     const subject = "";
//     const body = `${link}`;
//     console.log("============== in send email ===============");
//     console.log(session);

//     const res = await fetch(`${BACKEND_URL}/notifire/email`, {
//       headers: {
//         "content-type": "application/json",
//         authorization: `Bearer ${session.user.accessToken}`,
//       },
//       method: "POST",
//       body: JSON.stringify({
//         subject,
//         body,
//         recipient,
//       }),
//     });
//     const result = await res.json();
//     console.log(result);
//     return {
//       status: res.status,
//       result,
//     };
//   } catch (err) {
//     console.log(err);
//   }
// }

export default async function sendEmail({ link }: { link: string }) {
  try {
    const session: any = await getSession();
    const recipient = session.user.email;
    const subject =
      "Your Purchased Publication from Ethiopian Statistical Service";
    const body = `Dear Valued Customer,

Thank you for your purchase from the Ethiopian Statistical Service.  

You can access your publication using the link below:  

${link}  

If you have any questions or need further assistance, please do not hesitate to contact us.  

Best regards,  
Ethiopian Statistical Service`;

    console.log("============== in send email ===============");
    console.log(session);

    const res = await fetch(`${BACKEND_URL}/notifire/email`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        subject,
        body,
        recipient,
      }),
    });

    const result = await res.json();
    console.log(result);
    return {
      status: res.status,
      result,
    };
  } catch (err) {
    console.log(err);
  }
}
