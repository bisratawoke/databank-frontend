import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function fetchCategories() {
  const session: any = await getSession();
  const res = await fetch(`${BACKEND_URL}/categories`, {
    headers: {
      authorization: `Bearer ${session.user.accessToken}`,
    },
    method: "GET",
  });

  const body = await res.json();
  return {
    status: res.status,
    body,
  };
}
