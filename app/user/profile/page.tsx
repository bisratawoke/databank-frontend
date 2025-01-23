import React from "react";
import { redirect } from "next/navigation";

function page() {
  redirect("/user/profile/dashboard");
  return <div>page</div>
}

export default page;
