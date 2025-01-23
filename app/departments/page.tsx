"use server";
import React from "react";
import DepartmentsList from "./components/departments/DepartmentList";
import { Department } from "../components/types";
import DashboardPage from "../dashboard/page";

interface DepartmentsPageProps {
  departments: Department[];
}
export default async function DepartmentsPage({
  departments,
}: DepartmentsPageProps) {
  return (
    <div className="container mx-auto px-4">
      <DepartmentsList departments={departments} />
    </div>
  );
}
