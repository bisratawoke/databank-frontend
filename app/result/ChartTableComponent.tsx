"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, Radio, Table, Spin, Dropdown } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import StepsComponent from "../departments/components/StepsCompnent/StepsCompnent";
import * as XLSX from "xlsx";

interface FilteredValues {
  [fieldName: string]: string[];
}

interface DataItem {
  _id: string;
  field: {
    _id: string;
    name: string;
    type: {
      _id: string;
      name: string;
      description: string;
      exampleValue: string;
    };
  };
  value: string;
}

interface ProcessedData {
  [key: string]: string | number;
}

interface ChartTableComponentProps {
  report: {
    data: DataItem[];
    fields: {
      _id: string;
      name: string;
    }[];
  };
  selectedFilters: FilteredValues;
}

const ChartTableComponent: React.FC<ChartTableComponentProps> = ({
  report,
  selectedFilters,
}) => {
  const [timeFrame, setTimeFrame] = useState("6Month");
  const [data, setData] = useState<ProcessedData[]>([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    const transformData = (data: DataItem[], fields: any[]) => {
      const groupedByRow: { [key: string]: any } = {};

      // First pass: Group data by rows
      data.forEach((item) => {
        const fieldName = item.field.name;
        const value = item.value;
        const dataId = item._id;

        // Find or create a row index for this item
        let rowIndex = Object.keys(groupedByRow).find((key) => {
          const row = groupedByRow[key];
          return !row.hasOwnProperty(fieldName);
        });

        if (!rowIndex) {
          rowIndex = String(Object.keys(groupedByRow).length);
          groupedByRow[rowIndex] = {};
        }

        groupedByRow[rowIndex][fieldName] = value;
        groupedByRow[rowIndex][`${fieldName}_id`] = dataId;
      });

      // Second pass: Apply filters and transform the data
      const transformedData = Object.keys(groupedByRow).reduce(
        (acc, rowIndex) => {
          const row = groupedByRow[rowIndex];
          let includeRow = true;

          // Check if the row matches all selected filters
          for (const [fieldName, selectedValues] of Object.entries(
            selectedFilters
          )) {
            if (selectedValues.length > 0) {
              const rowValue = row[fieldName];
              if (!selectedValues.includes(rowValue)) {
                includeRow = false;
                break;
              }
            }
          }

          // Only include the row if it passes all filters
          if (includeRow) {
            const processedRow: any = { key: parseInt(rowIndex) };

            fields.forEach((field) => {
              const fieldName = field.name;
              processedRow[fieldName] = row[fieldName] || "";
              processedRow[`${fieldName}_id`] = row[`${fieldName}_id`] || null;
            });

            acc.push(processedRow);
          }

          return acc;
        },
        [] as any[]
      );

      return transformedData;
    };

    const uniqueFields = new Set(
      report.data
        .map((item) => item.field.name)
        .sort((a, b) => a.localeCompare(b))
    );
    const tableColumns = Array.from(uniqueFields).map((fieldName) => ({
      title: fieldName,
      dataIndex: fieldName,
      key: fieldName,
      width: 150,
      render: (value: any) => value || "-",
    }));

    // Transform and filter the data
    const transformedData = transformData(report.data, report.fields);

    setData(transformedData);
    setColumns(tableColumns);
    setLoading(false);
  }, [report, selectedFilters]);

  const handleTimeFrameChange = (e: any) => {
    setTimeFrame(e.target.value);
  };

  const prepareDataForExport = (data: any[]) => {
    return data.map((row) => {
      const cleanedRow: { [key: string]: any } = {};
      Object.entries(row).forEach(([key, value]) => {
        // Only include regular field names, exclude IDs and key
        if (!key.endsWith("_id") && key !== "key") {
          cleanedRow[key] = value;
        }
      });
      return cleanedRow;
    });
  };

  // Export to Excel function
  const exportToExcel = (data: any[]) => {
    const cleanedData = prepareDataForExport(data);
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report_data.xlsx`);
  };

  // Export to CSV function
  const exportToCSV = (data: any[]) => {
    const cleanedData = prepareDataForExport(data);
    const headers = Object.keys(cleanedData[0]);
    const csvContent = [
      headers.join(","),
      ...cleanedData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]?.toString() || "";
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_data.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle export based on type
  const handleExport = (type: "excel" | "csv") => {
    if (type === "excel") {
      exportToExcel(data);
    } else {
      exportToCSV(data);
    }
  };

  // Dropdown menu items for export options
  const exportMenuItems = {
    items: [
      {
        key: "excel",
        label: "Export to Excel",
        onClick: () => handleExport("excel"),
      },
      {
        key: "csv",
        label: "Export to CSV",
        onClick: () => handleExport("csv"),
      },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const chartData = data.map((row) => {
    const chartRow: any = { name: row[columns[0]?.dataIndex] || "Unknown" };
    columns.slice(1).forEach((col) => {
      chartRow[col.dataIndex] = isNaN(Number(row[col.dataIndex]))
        ? row[col.dataIndex]
        : Number(row[col.dataIndex]);
    });
    return chartRow;
  });

  return (
    <>
      <StepsComponent currentStep={2} />
      <div className="p-5 max-w-[1200px] mx-auto text-center">
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-2">
            <Button
              type={view === "table" ? "primary" : "default"}
              onClick={() => setView("table")}
            >
              Show as table
            </Button>
            <Button
              type={view === "chart" ? "primary" : "default"}
              onClick={() => setView("chart")}
            >
              Show as chart
            </Button>
            <Button
              type={view === "description" ? "primary" : "default"}
              onClick={() => setView("description")}
            >
              Description
            </Button>
          </div>
          <div className="flex gap-2">
            <Dropdown menu={exportMenuItems} placement="bottomRight">
              <Button icon={<DownloadOutlined />}>Export</Button>
            </Dropdown>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>

        <Radio.Group
          onChange={handleTimeFrameChange}
          value={timeFrame}
          className="mb-5"
        >
          <Radio.Button value="1Month">1 Month</Radio.Button>
          <Radio.Button value="3Month">3 Month</Radio.Button>
          <Radio.Button value="6Month">6 Month</Radio.Button>
          <Radio.Button value="1Year">1 Year</Radio.Button>
          <Radio.Button value="2Year">2 Year</Radio.Button>
          <Radio.Button value="5Year">5 Year</Radio.Button>
        </Radio.Group>

        {view === "table" && (
          <Table
            dataSource={data}
            columns={columns}
            rowKey="key"
            className="mt-10"
            bordered
          />
        )}

        {view === "chart" && data.length > 0 && (
          <div className="mt-10">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {columns.slice(1).map((column, index) => (
                  <Bar
                    key={column.key}
                    dataKey={column.dataIndex}
                    fill={`hsl(${index * 120}, 70%, 50%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {view === "description" && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Report Description</h3>
            <p className="text-left">
              This report shows the distribution of data across different
              categories based on the selected filters. When no filters are
              applied, all data points are displayed. Each row represents a
              complete record with its associated field values properly mapped
              to their respective columns.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChartTableComponent;
