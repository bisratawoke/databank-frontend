"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";
export default async function fetchDepatments() {
  const session: any = await getSession();

  const res = await fetch(`${BACKEND_URL}/departments`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "GET",
  });
  const result = await res.json();
  return {
    body: result,
    status: res.status,
  };
}
