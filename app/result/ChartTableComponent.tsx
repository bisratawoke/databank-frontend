// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Button, Radio, Table, Spin, Dropdown } from "antd";
// import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
// import StepsComponent from "../departments/components/StepsCompnent/StepsCompnent";
// import * as XLSX from "xlsx";

// interface FilteredValues {
//   [fieldName: string]: string[];
// }

// interface DataItem {
//   _id: string;
//   field: {
//     _id: string;
//     name: string;
//     type: {
//       _id: string;
//       name: string;
//       description: string;
//       exampleValue: string;
//     };
//   };
//   value: string;
// }

// interface ProcessedData {
//   [key: string]: string | number;
// }

// interface ChartTableComponentProps {
//   report: {
//     data: DataItem[];
//     fields: {
//       _id: string;
//       name: string;
//     }[];
//   };
//   selectedFilters: FilteredValues;
// }

// const ChartTableComponent: React.FC<ChartTableComponentProps> = ({
//   report,
//   selectedFilters,
// }) => {
//   const [timeFrame, setTimeFrame] = useState("6Month");
//   const [data, setData] = useState<ProcessedData[]>([]);
//   const [view, setView] = useState("table");
//   const [loading, setLoading] = useState(true);
//   const [columns, setColumns] = useState<any[]>([]);

//   useEffect(() => {
//     const transformData = (data: DataItem[], fields: any[]) => {
//       const groupedByRow: { [key: string]: any } = {};

//       // First pass: Group data by rows
//       data.forEach((item) => {
//         const fieldName = item.field.name;
//         const value = item.value;
//         const dataId = item._id;

//         // Find or create a row index for this item
//         let rowIndex = Object.keys(groupedByRow).find((key) => {
//           const row = groupedByRow[key];
//           return !row.hasOwnProperty(fieldName);
//         });

//         if (!rowIndex) {
//           rowIndex = String(Object.keys(groupedByRow).length);
//           groupedByRow[rowIndex] = {};
//         }

//         groupedByRow[rowIndex][fieldName] = value;
//         groupedByRow[rowIndex][`${fieldName}_id`] = dataId;
//       });

//       // Second pass: Apply filters and transform the data
//       const transformedData = Object.keys(groupedByRow).reduce(
//         (acc, rowIndex) => {
//           const row = groupedByRow[rowIndex];
//           let includeRow = true;

//           // Check if the row matches all selected filters
//           for (const [fieldName, selectedValues] of Object.entries(
//             selectedFilters
//           )) {
//             if (selectedValues.length > 0) {
//               const rowValue = row[fieldName];
//               if (!selectedValues.includes(rowValue)) {
//                 includeRow = false;
//                 break;
//               }
//             }
//           }

//           // Only include the row if it passes all filters
//           if (includeRow) {
//             const processedRow: any = { key: parseInt(rowIndex) };

//             fields.forEach((field) => {
//               const fieldName = field.name;
//               processedRow[fieldName] = row[fieldName] || "";
//               processedRow[`${fieldName}_id`] = row[`${fieldName}_id`] || null;
//             });

//             acc.push(processedRow);
//           }

//           return acc;
//         },
//         [] as any[]
//       );

//       return transformedData;
//     };

//     const uniqueFields = new Set(
//       report.data
//         .map((item) => item.field.name)
//         .sort((a, b) => a.localeCompare(b))
//     );
//     const tableColumns = Array.from(uniqueFields).map((fieldName) => ({
//       title: fieldName,
//       dataIndex: fieldName,
//       key: fieldName,
//       width: 150,
//       render: (value: any) => value || "-",
//     }));

//     // Transform and filter the data
//     const transformedData = transformData(report.data, report.fields);

//     setData(transformedData);
//     setColumns(tableColumns);
//     setLoading(false);
//   }, [report, selectedFilters]);

//   const handleTimeFrameChange = (e: any) => {
//     setTimeFrame(e.target.value);
//   };

//   const prepareDataForExport = (data: any[]) => {
//     return data.map((row) => {
//       const cleanedRow: { [key: string]: any } = {};
//       Object.entries(row).forEach(([key, value]) => {
//         // Only include regular field names, exclude IDs and key
//         if (!key.endsWith("_id") && key !== "key") {
//           cleanedRow[key] = value;
//         }
//       });
//       return cleanedRow;
//     });
//   };

//   // Export to Excel function
//   const exportToExcel = (data: any[]) => {
//     const cleanedData = prepareDataForExport(data);
//     const ws = XLSX.utils.json_to_sheet(cleanedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Report");
//     XLSX.writeFile(wb, `report_data.xlsx`);
//   };

//   // Export to CSV function
//   const exportToCSV = (data: any[]) => {
//     const cleanedData = prepareDataForExport(data);
//     const headers = Object.keys(cleanedData[0]);
//     const csvContent = [
//       headers.join(","),
//       ...cleanedData.map((row) =>
//         headers
//           .map((header) => {
//             const value = row[header]?.toString() || "";
//             return `"${value.replace(/"/g, '""')}"`;
//           })
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `report_data.csv`;
//     link.click();
//     URL.revokeObjectURL(link.href);
//   };

//   // Handle export based on type
//   const handleExport = (type: "excel" | "csv") => {
//     if (type === "excel") {
//       exportToExcel(data);
//     } else {
//       exportToCSV(data);
//     }
//   };

//   // Dropdown menu items for export options
//   const exportMenuItems = {
//     items: [
//       {
//         key: "excel",
//         label: "Export to Excel",
//         onClick: () => handleExport("excel"),
//       },
//       {
//         key: "csv",
//         label: "Export to CSV",
//         onClick: () => handleExport("csv"),
//       },
//     ],
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   const chartData = data.map((row) => {
//     const chartRow: any = { name: row[columns[0]?.dataIndex] || "Unknown" };
//     columns.slice(1).forEach((col) => {
//       chartRow[col.dataIndex] = isNaN(Number(row[col.dataIndex]))
//         ? row[col.dataIndex]
//         : Number(row[col.dataIndex]);
//     });
//     return chartRow;
//   });

//   return (
//     <div className="container justify-center">
//       <StepsComponent currentStep={2} />
//       <div className="p-5 max-w-[1200px] mx-auto text-center">
//         <div className="flex justify-between items-center mb-5">
//           <div className="flex gap-2">
//             <Button
//               type={view === "table" ? "primary" : "default"}
//               onClick={() => setView("table")}
//             >
//               Show as table
//             </Button>
//             <Button
//               type={view === "chart" ? "primary" : "default"}
//               onClick={() => setView("chart")}
//             >
//               Show as chart
//             </Button>
//             {/* <Button
//               type={view === "description" ? "primary" : "default"}
//               onClick={() => setView("description")}
//             >
//               Description
//             </Button> */}
//           </div>
//           <div className="flex gap-2">
//             <Dropdown menu={exportMenuItems} placement="bottomRight">
//               <Button icon={<DownloadOutlined />}>Export</Button>
//             </Dropdown>
//             <Button icon={<PrinterOutlined />} onClick={handlePrint}>
//               Print
//             </Button>
//           </div>
//         </div>

//         {/* <Radio.Group
//           onChange={handleTimeFrameChange}
//           value={timeFrame}
//           className="mb-5"
//         >
//           <Radio.Button value="1Month">1 Month</Radio.Button>
//           <Radio.Button value="3Month">3 Month</Radio.Button>
//           <Radio.Button value="6Month">6 Month</Radio.Button>
//           <Radio.Button value="1Year">1 Year</Radio.Button>
//           <Radio.Button value="2Year">2 Year</Radio.Button>
//           <Radio.Button value="5Year">5 Year</Radio.Button>
//         </Radio.Group> */}

//         {view === "table" && (
//           <Table
//             dataSource={data}
//             columns={columns}
//             rowKey="key"
//             className="mt-10"
//             bordered
//           />
//         )}

//         {view === "chart" && data.length > 0 && (
//           <div className="mt-10">
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart
//                 data={chartData}
//                 margin={{
//                   top: 5,
//                   right: 30,
//                   left: 20,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 {columns.slice(1).map((column, index) => (
//                   <Bar
//                     key={column.key}
//                     dataKey={column.dataIndex}
//                     fill={`hsl(${index * 120}, 70%, 50%)`}
//                   />
//                 ))}
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {view === "description" && (
//           <div className="mt-10">
//             <h3 className="text-xl font-semibold mb-4">Report Description</h3>
//             <p className="text-left">
//               This report shows the distribution of data across different
//               categories based on the selected filters. When no filters are
//               applied, all data points are displayed. Each row represents a
//               complete record with its associated field values properly mapped
//               to their respective columns.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChartTableComponent;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Button,
  Radio,
  Table,
  Spin,
  Dropdown,
  Input,
  Select,
  Popover,
  message,
  Pagination,
} from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import StepsComponent from "../departments/components/StepsCompnent/StepsCompnent";
import MapComponent from "./MapComponent";

// Existing interfaces remain the same
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

// Updated interface to include columnsOrder prop
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

// Existing constants and helper functions remain the same
const COLOR_PALETTE = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const ChartComponents = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
};

// Helper function to round numbers to two decimal places
function roundToTwoDecimals(value: any): any {
  if (typeof value === "number") {
    return Number(value.toFixed(2));
  }
  return value;
}

function trimName(name: string, maxLength: number = 14): string {
  if (!name || typeof name !== "string") return "";

  if (name.length <= maxLength) {
    return name;
  }

  return `${name.substring(0, maxLength)}...`;
}

function removeLeadingZeros(value: string | number) {
  if (typeof value === "string") {
    return value.replace(/^0+/, "") || "0"; // Ensure "000" becomes "0"
  }
  return value; // Return numeric values as-is
}

const ChartTableComponent: React.FC<ChartTableComponentProps> = ({
  report,
  selectedFilters,
}) => {
  console.log("reports recieved: ", report);
  console.log("selectedFilters in charttable: ", selectedFilters);
  const [timeFrame, setTimeFrame] = useState("6Month");
  const [data, setData] = useState<ProcessedData[]>([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<any[]>([]);

  // Existing state variables remain the same
  const [chartType, setChartType] = useState("bar");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<ProcessedData[]>([]);
  const [chartConfig, setChartConfig] = useState<{
    xAxis: string;
    yAxis: string[];
  }>({ xAxis: "", yAxis: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const transformData = (data: DataItem[], fields: any[]) => {
      const groupedByRow: { [key: string]: any } = {};

      // console.log("groupedByRow: ", groupedByRow);

      // console.log("data: ", data);
      // console.log("fields: ", fields);

      // Group the data by row
      data.forEach((item) => {
        const fieldName = item.field.name;
        const value = removeLeadingZeros(item.value);
        const dataId = item._id;

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

      // Filter rows based on selectedFilters
      const transformedData = Object.keys(groupedByRow).reduce(
        (acc, rowIndex) => {
          const row = groupedByRow[rowIndex];
          let includeRow = true;

          // Apply filters dynamically
          for (const [fieldName, selectedValues] of Object.entries(
            selectedFilters
          )) {
            const rowValue = row[fieldName];
            if (
              selectedValues.length > 0 &&
              !selectedValues.includes(rowValue)
            ) {
              includeRow = false;
              break;
            }
          }

          if (includeRow) {
            const processedRow: ProcessedData = { key: parseInt(rowIndex) };

            fields.forEach((field) => {
              const fieldName = field.name;
              processedRow[fieldName] = row[fieldName] || "";
              processedRow[`${fieldName}_id`] = row[`${fieldName}_id`] || null;
            });

            acc.push(processedRow);
          }

          console.log("acc: ", acc);
          return acc;
        },
        [] as ProcessedData[]
      );

      // console.log("Filtered and Transformed Data: ", transformedData);
      return transformedData;
    };

    try {
      if (!report || !report.data || report.data.length === 0) {
        message.warning("No data available for processing");
        setData([]);
        setFilteredData([]);
        setLoading(false);
        return;
      }

      // Dynamic column creation
      const uniqueFields = new Set(report.data.map((item) => item.field.name));
      const orderedFields = Array.from(uniqueFields);

      const tableColumns = [
        {
          title: "No.",
          dataIndex: "no",
          key: "no",
          width: 60,
          render: (_: any, __: any, index: number) => index + 1,
        },
        ...orderedFields.map((fieldName) => ({
          title: fieldName,
          dataIndex: fieldName,
          key: fieldName,
          width: 150,
          sorter: (a: any, b: any) => {
            const valueA = a[fieldName];
            const valueB = b[fieldName];
            return !isNaN(Number(valueA)) && !isNaN(Number(valueB))
              ? Number(valueA) - Number(valueB)
              : (valueA || "").localeCompare(valueB || "");
          },
          render: (value: any) =>
            !isNaN(Number(value))
              ? roundToTwoDecimals(Number(value))
              : trimName(value) || "-",
        })),
      ];

      // Transform and filter the data
      const transformedData = transformData(report.data, report.fields).map(
        (item, index) => ({
          ...item,
          no: index + 1,
        })
      );

      setData(transformedData);
      setFilteredData(transformedData); // Set the filtered data for rendering
      setColumns(tableColumns);

      // Chart configuration setup
      if (transformedData.length > 0) {
        const numericColumns = tableColumns
          .filter((col) =>
            transformedData.some((row) => !isNaN(Number(row[col.dataIndex])))
          )
          .map((col) => col.dataIndex);

        setChartConfig({
          xAxis: tableColumns[0]?.dataIndex || "",
          yAxis: numericColumns.slice(0, 4),
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error processing data:", error);
      message.error("Failed to process data");
      setLoading(false);
    }
  }, [report, selectedFilters]);

  // Search functionality
  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );

    setFilteredData(filtered);
  }, [searchText, data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Paginate the filtered data
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    if (!chartConfig.xAxis) return [];

    if (chartType === "pie") {
      const pieData = paginatedData
        .map((row) => {
          const yAxis = chartConfig.yAxis[0];
          return {
            name: row[chartConfig.xAxis] || "Unknown",
            value: yAxis ? Number(row[yAxis]) : 0,
          };
        })
        .filter((item) => item.value > 0);

      return pieData;
    }

    return paginatedData.map((row) => {
      const chartRow: any = {
        name: row[chartConfig.xAxis] || "Unknown",
      };

      chartConfig.yAxis.forEach((yAxis) => {
        chartRow[yAxis] = isNaN(Number(row[yAxis]))
          ? row[yAxis]
          : Number(row[yAxis]);
      });

      return chartRow;
    });
  }, [filteredData, chartConfig, chartType, currentPage, pageSize]);

  // Export functions
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
    const headers = Object.keys(cleanedData[0] || {});
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
      exportToExcel(filteredData); // Use filteredData instead of data
    } else {
      exportToCSV(filteredData); // Use filteredData instead of data
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

  // Print function
  const handlePrint = () => {
    window.print();
  };
  // Chart configuration popover
  const ChartConfigPopover = (
    <div>
      <div className="mb-2">
        <label>X-Axis (for Pie: Category):</label>
        <Select
          style={{ width: "100%" }}
          value={chartConfig.xAxis}
          onChange={(value) =>
            setChartConfig((prev) => ({ ...prev, xAxis: value }))
          }
        >
          {columns.map((col) => (
            <Select.Option key={col.dataIndex} value={col.dataIndex}>
              {col.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <label>
          {chartType === "pie" ? "Pie Chart Value" : "Y-Axis (Numeric Columns)"}
        </label>
        <Select
          mode={chartType !== "pie" ? "multiple" : "default"}
          style={{ width: "100%" }}
          value={chartConfig.yAxis}
          onChange={(values) =>
            setChartConfig((prev) => ({
              ...prev,
              yAxis: Array.isArray(values) ? values : [values],
            }))
          }
        >
          {columns
            .filter((col) =>
              filteredData.some((row) => !isNaN(Number(row[col.dataIndex])))
            )
            .map((col) => (
              <Select.Option key={col.dataIndex} value={col.dataIndex}>
                {col.title}
              </Select.Option>
            ))}
        </Select>
      </div>
    </div>
  );

  // Render chart dynamically based on selected type
  const renderChart = () => {
    if (chartData.length === 0) return null;

    const Chart = ChartComponents[chartType as keyof typeof ChartComponents];

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartType !== "pie" ? (
          <Chart
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

            {chartConfig.yAxis.map((yAxis, index) =>
              chartType === "bar" ? (
                <Bar
                  key={yAxis}
                  dataKey={yAxis}
                  fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                />
              ) : (
                <Line
                  key={yAxis}
                  type="monotone"
                  dataKey={yAxis}
                  stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                />
              )
            )}
          </Chart>
        ) : (
          <Chart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </Chart>
        )}
      </ResponsiveContainer>
    );
  };

  const sampleData = [
    {
      latitude: 9.045,
      longitude: 38.7468,
      name: "Addis Ababa",
      value: 100,
    },
  ];

  const handleRegionClick = (region) => {
    console.log("Selected Region:", region);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {/* <StepsComponent currentStep={2} /> */}
      <div className="p-5 max-w-[1200px] mx-auto text-center">
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-2">
            <Button
              type={view === "table" ? "primary" : "default"}
              onClick={() => setView("table")}
            >
              Table
            </Button>
            <Button
              type={view === "chart" ? "primary" : "default"}
              onClick={() => setView("chart")}
            >
              Chart
            </Button>
            <Button
              type={view === "map" ? "primary" : "default"}
              onClick={() => setView("map")}
            >
              Map
            </Button>
          </div>
          <div className="flex gap-2">
            <Input.Search
              placeholder="Search in table"
              allowClear
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Dropdown menu={exportMenuItems} placement="bottomRight">
              <Button icon={<DownloadOutlined />}>Export</Button>
            </Dropdown>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>

        {view === "chart" && (
          <div className="flex items-center justify-center gap-4 mb-4">
            <Radio.Group
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <Radio.Button value="bar">Bar Chart</Radio.Button>
              <Radio.Button value="line">Line Chart</Radio.Button>
              <Radio.Button value="pie">Pie Chart</Radio.Button>
            </Radio.Group>
            <Popover
              content={ChartConfigPopover}
              title="Chart Configuration"
              trigger="click"
              placement="bottom"
            >
              <Button icon={<SettingOutlined />}>Configure Chart</Button>
            </Popover>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={(page, newPageSize) => {
                setCurrentPage(page);
                setPageSize(newPageSize || 10);
              }}
              showSizeChanger
            />
          </div>
        )}

        {view === "table" && (
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="key"
            className="mt-10"
            bordered
            size="small"
          />
        )}

        {view === "chart" && <div className="mt-10">{renderChart()}</div>}
        {view === "map" && (
          <div className="mt-10">
            <MapComponent onRegionClick={handleRegionClick} />
          </div>
        )}
      </div>
    </>
  );
};

export default ChartTableComponent;
