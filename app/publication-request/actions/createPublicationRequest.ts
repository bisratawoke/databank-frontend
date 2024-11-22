"use server";

import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";
export default async function createPublicationRequest(values: any) {
  const session: any = await getSession();

  const res = await fetch(`${BACKEND_URL}/publication-request`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ ...values, status: "Pending" }),
  });

  console.log("========= in create publciation request =================");

  const body = await res.json();
  console.log(res.status);
  console.log(body);
  console.log(values);

  return {
    body,
    status: res.status,
  };
}
