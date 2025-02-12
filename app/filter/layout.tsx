import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: any = await getSession();

  if (!session.accessToken) redirect("/api/auth/signin");
  return (
    <>
      {/* <StepsComponent currentStep={0} /> */}
      {children}
    </>
  );
}
