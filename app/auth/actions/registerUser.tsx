"use server";
import { BACKEND_URL } from "@/constants/constants";

export default async function registerUser(payload) {
  console.log("payload: ", payload);
  const res = await fetch(`${BACKEND_URL}/portal-users/register`, {
    headers: {
      "content-type": "application/json",
      cache: "no-cache",
    },
    body: JSON.stringify({ ...payload }),
    method: "POST",
  });
  const result = await res.json();
  return {
    body: result,
    status: res.status,
  };
}
