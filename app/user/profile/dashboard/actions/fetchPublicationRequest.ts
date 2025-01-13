"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function fetchPublicationRequets() {
  const session: any = await getSession();

  const res = await fetch(`${BACKEND_URL}/publication-request/me`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
      cache: "no-cache",
    },
    method: "GET",
    cache: "no-store",
  });

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
