// "use server";
// import React from "react";
// import DepartmentsList from "./components/departments/DepartmentList";
// import { Department } from "../components/types";
// import DashboardPage from "../dashboard/page";

// interface DepartmentsPageProps {
//   departments: Department[];
// }
// export default async function DepartmentsPage({
//   departments,
// }: DepartmentsPageProps) {
//   return (
//     <div className="container mx-auto px-4">
//       <DepartmentsList departments={departments} />
//     </div>
//   );
// }

"use server";
import React from "react";
import DepartmentsList from "./components/departments/DepartmentList";
import { Department } from "../components/types";
import DashboardPage from "../dashboard/page";

interface DepartmentsPageProps {
  departments: Department[];
}

export const metadata = {
  title: "Departments | My Company",
  description:
    "Explore the different departments in our company. Learn about our team structures, operations, and how we work together to achieve excellence.",
  keywords:
    "departments, teams, company structure, organization, business operations",
  openGraph: {
    title: "Departments | My Company",
    description:
      "Explore the different departments in our company. Learn about our team structures, operations, and how we work together to achieve excellence.",
    url: "https://www.example.com/departments", // update this URL
    siteName: "My Company",
    images: [
      {
        url: "https://www.example.com/og-image.jpg", // update with your image URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Departments | My Company",
    description:
      "Explore the different departments in our company. Learn about our team structures, operations, and how we work together to achieve excellence.",
    images: ["https://www.example.com/og-image.jpg"], // update with your image URL
  },
};

export default async function DepartmentsPage({
  departments,
}: DepartmentsPageProps) {
  return (
    <div className="container mx-auto px-4">
      <DepartmentsList departments={departments} />
    </div>
  );
}
