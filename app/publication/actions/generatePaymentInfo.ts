"use server";
import axios from "axios";

import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export async function generatePaymentInfo() {
  try {
    const session: any = await getSession();

    const body = {
      price: 100,
      paymentStatus: "Pending",
      author: session.user.id,
    };

    const response = await axios.post(
      `${BACKEND_URL}/publication-payments`,
      body
    );

    return { ok: true, message: response.data };
  } catch (error) {
    return { ok: false, message: "something went wrong" };
  }
}
