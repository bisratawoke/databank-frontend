"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function EditUserInfo({
  payload,
}: {
  payload: Record<string, any>;
}) {
  const session: any = await getSession();
  const result = await fetch(`${BACKEND_URL}/portal-users/${payload._id}`, {
    body: JSON.stringify(payload),
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
      "content-type": "application/json",
    },
    method: "PATCH",
  });
  const res = await result.json();

  return {
    status: result.status,
    body: res,
  };
}
