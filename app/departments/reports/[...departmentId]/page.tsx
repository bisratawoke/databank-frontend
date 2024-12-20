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
  status: string;
}

const ReportPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = pathname.split("/").slice(-2);

  const departmentId = params[0];
  const subcategoryId = params[1];

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/departments`);
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

        const uniqueReports = Array.from(
          new Set(filteredReports.map((report) => report._id))
        )
          .map((id) => filteredReports.find((report) => report._id === id))
          .filter((report) => report.status === "published");

        console.log("uniqueReports: ", uniqueReports);
        setReports(uniqueReports as Report[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  const handleRowClick = (reportId: string) => {
    router.push(`/filter/${reportId}`);
  };

  const columns = [
    {
      title: "Report Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin spinning={loading} size="large">
          <div className="p-12">Loading reports...</div>
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-red-50 rounded-lg">
          <span className="text-red-600">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Available Reports
            </h2>
          </div>
          {reports.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No reports found for this subcategory.
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table<Report>
                columns={columns}
                dataSource={reports}
                pagination={false}
                rowKey="_id"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record._id),
                  className:
                    "transition-colors duration-150 hover:bg-blue-50 cursor-pointer",
                })}
                className="ant-table-custom"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .ant-table-custom .ant-table-thead > tr > th {
          background-color: #f8fafc;
          color: #1f2937;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
          padding: 16px;
        }

        .ant-table-custom .ant-table-tbody > tr > td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .ant-table-custom .ant-table-tbody > tr:last-child > td {
          border-bottom: none;
        }

        .ant-table-custom .ant-table-cell {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default ReportPage;
