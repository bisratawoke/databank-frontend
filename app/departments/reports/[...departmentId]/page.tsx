// app/departments/reports/[...departmentId]/page.tsx

"use client";  

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; 
import { Table, Spin } from "antd";

// Define the type for the report data structure
interface Report {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

const ReportPage = () => {
  const router = useRouter(); // Initialize useRouter for client-side navigation
  const pathname = usePathname(); // Get the current pathname
  const params = pathname.split("/").slice(-2); // Extract the last two segments

  const departmentId = params[0]; // First segment (department ID)
  const subcategoryId = params[1]; // Second segment (subcategory ID)

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3016/departments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const filteredReports = data.flatMap((department: any) =>
          department.category.flatMap((category: any) =>
            category.subcategory
              .filter((subcategory: any) => subcategory._id === subcategoryId)
              .flatMap((subcategory: any) => subcategory.report)
          )
        );

        // Remove duplicate reports based on their ID
        const uniqueReports = Array.from(
          new Set(filteredReports.map((report) => report._id))
        ).map((id) => filteredReports.find((report) => report._id === id));

        setReports(uniqueReports as Report[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  // Handle row click and navigate to the filter page using router.push
  const handleRowClick = (reportId: string) => {
    router.push(`/filter/${reportId}`); // Navigate to the filter route with reportId
  };

  const columns = [
    {
      title: "Report Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString()}</span>
      ),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString()}</span>
      ),
    },
  ];

  if (loading) {
    return <Spin spinning={loading}>Loading reports...</Spin>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {reports.length === 0 ? (
        <p>No reports found for this subcategory.</p>
      ) : (
        <Table<Report>
          columns={columns}
          dataSource={reports}
          pagination={false}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record._id), // Handle row click
            style: { cursor: "pointer" }, // Cursor pointer effect
          })}
          rowClassName="hover-row" // Custom hover class
        />
      )}
      <style jsx>{`
        .hover-row:hover {
          background-color: #f5f5f5; // Change background on hover
        }
      `}</style>
    </div>
  );
};

export default ReportPage;
