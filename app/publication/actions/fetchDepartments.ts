"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";
export default async function fetchDepatments() {
  const session: any = await getSession();
  console.log("=========== in fetch depatments publication =================");
  console.log(session.user.accessToken);
  const res = await fetch(`${BACKEND_URL}/departments`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "GET",
  });
  const result = await res.json();

  console.log(result);
  return {
    body: result,
    status: res.status,
  };
}
