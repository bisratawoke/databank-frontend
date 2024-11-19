"use server";
import { BACKEND_URL } from "@/constants/constants";
import { getSession } from "@/lib/auth";

export default async function fetchPublicationByDepartmentIdAndCategoryId({
  departmentId,
  categoryId,
}: {
  departmentId: string;
  categoryId: string;
}) {
  const session: any = await getSession();

  const res = await fetch(
    `${BACKEND_URL}/publications/department/${departmentId}/category/${categoryId}`,
    {
      headers: {
        authorization: `Bearer ${session.user.accessToken}`,
      },
      method: "GET",
    }
  );

  const result = await res.json();

  return {
    body: result,
    status: res.status,
  };
}
