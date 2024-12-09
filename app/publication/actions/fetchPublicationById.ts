"use server";

import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";
export default async function FetchPublicationById({
  publicationId,
}: {
  publicationId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(`${BACKEND_URL}/publications/${publicationId}`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "GET",
  });

  const result = await res.json();

  return {
    status: res.status,
    body: result,
  };
}
