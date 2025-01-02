"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function fetchUserInfo() {
  const session: any = await getSession();
  console.log(session.user);
  const result = await fetch(`${BACKEND_URL}/portal-users/me`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  const res = await result.json();

  return {
    data: res,
    status: result.status,
  };
}
