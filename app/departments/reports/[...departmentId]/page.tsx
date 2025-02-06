"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Table, Input, Select, DatePicker, Spin, Empty, Tooltip } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Category, Department, SubCategory } from "@/app/components/types";

// Define the type for the report data structure
interface Report {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function ReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = pathname.split("/").slice(-2);
  const subcategoryId = params[1];

  // State management
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [sortConfig, setSortConfig] = useState<{
    column: keyof Report | null;
    direction: "asc" | "desc";
  }>({ column: null, direction: "asc" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/departments`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const filteredReports = data.flatMap((department: Department) =>
          department.category.flatMap((category: Category) =>
            category.subcategory
              .filter(
                (subcategory: SubCategory) => subcategory._id === subcategoryId
              )
              .flatMap((subcategory: SubCategory) => subcategory.report)
          )
        );

        const uniqueReports = Array.from(
          new Set(filteredReports.map((report: Report) => report._id))
        )
          .map((id) =>
            filteredReports.find((report: Report) => report._id === id)
          )
          .filter((report) => report.status === "published");

        setReports(uniqueReports as Report[]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId, API_URL]);

  // Filtering and sorting logic
  const processedReports = useMemo(() => {
    let result = [...reports];

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (report) =>
          report.name.toLowerCase().includes(lowerSearchTerm) ||
          report.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((report) => report.status === statusFilter);
    }

    // Date range filter
    if (dateRangeFilter && dateRangeFilter[0] && dateRangeFilter[1]) {
      result = result.filter((report) => {
        const reportStartDate = new Date(report.start_date);
        return (
          reportStartDate >= dateRangeFilter[0]! &&
          reportStartDate <= dateRangeFilter[1]!
        );
      });
    }

    // Sorting
    if (sortConfig.column) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.column!];
        const bValue = b[sortConfig.column!];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
          ? 1
          : -1;
      });
    }

    return result;
  }, [reports, searchTerm, statusFilter, dateRangeFilter, sortConfig]);

  const handleRowClick = (reportId: string) => {
    router.push(`/filter/${reportId}`);
  };

  const handleSort = (column: keyof Report) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const columns = [
    {
      title: (
        <div className="flex items-center">
          Report Name
          <Tooltip title="Sort by Report Name">
            <SortAscendingOutlined
              className="ml-2 cursor-pointer hover:text-blue-500"
              onClick={() => handleSort("name")}
            />
          </Tooltip>
        </div>
      ),
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
      title: (
        <div className="flex items-center">
          Start Date
          <Tooltip title="Sort by Start Date">
            <SortAscendingOutlined
              className="ml-2 cursor-pointer hover:text-blue-500"
              onClick={() => handleSort("start_date")}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          End Date
          <Tooltip title="Sort by End Date">
            <SortAscendingOutlined
              className="ml-2 cursor-pointer hover:text-blue-500"
              onClick={() => handleSort("end_date")}
            />
          </Tooltip>
        </div>
      ),
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spin spinning={loading} size="large">
          <div className="p-12">Loading reports...</div>
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-6 bg-red-50 rounded-lg shadow-md">
          <span className="text-red-600 font-semibold">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Filter and Search Section */}
          <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800 flex-grow">
              Available Reports
            </h2>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Search Input */}
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search reports"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />

              {/* Status Filter */}
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder="Status"
                onChange={(value) => setStatusFilter(value)}
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              >
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="draft">Draft</Select.Option>
              </Select>

              {/* Date Range Filter */}
              <DatePicker.RangePicker
                onChange={(dates) => setDateRangeFilter(dates)}
                className="w-64"
              />
            </div>
          </div>

          {/* Reports Table */}
          {processedReports.length === 0 ? (
            <Empty description="No reports found" className="py-12" />
          ) : (
            <div className="overflow-hidden">
              <Table<Report>
                columns={columns}
                dataSource={processedReports}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total: processedReports.length,
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} reports`,
                }}
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
    </div>
  );
}
