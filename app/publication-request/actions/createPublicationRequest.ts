"use server";

import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function createPublicationRequest(formData: FormData) {
  const session: any = await getSession();

  const res = await fetch(`${BACKEND_URL}/publication-request`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "POST",
    body: formData,
  });

  const body = await res.json();

  await fetch(
    `${BACKEND_URL}/publication-request/dissmination-assign-department/${body._id}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        _id: body._id,
      }),
    }
  );

  return {
    body,
    status: res.status,
  };
}
