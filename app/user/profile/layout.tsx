import React from "react";
import LayoutComp from "./components/layout/Layout";
import { getSession } from "@/lib/auth";
async function layout({ children }: { children: React.ReactNode }) {
  const session: any = await getSession();

  return <LayoutComp>{children}</LayoutComp>;
}

export default layout;
