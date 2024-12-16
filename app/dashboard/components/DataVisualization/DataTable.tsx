/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { memo, useMemo } from "react";
import { Table, Typography } from "antd";
import { useReportData } from "../../hooks/useReportData";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface DataTableProps {
  reportId?: string;
  filters?: Record<string, any>;
}

const DataTable: React.FC<DataTableProps> = memo(
  ({ reportId, filters = {} }) => {
    const { data, isLoading, page, setPage, pageSize, totalItems } =
      useReportData(reportId || "", filters);

    // Transform data to match table requirements
    const transformedData = useMemo(() => {
      if (!data || data.length === 0) return [];

      // Assuming data is in the format of field-value pairs
      return data.map((item, index) => {
        const transformedItem: Record<string, any> = { key: index };

        // Assuming each item has a 'field' and 'value' structure
        item.forEach((fieldData: any) => {
          // Use field name as key, value as value
          transformedItem[fieldData.field.name] = fieldData.value;
        });

        return transformedItem;
      });
    }, [data]);

    // Dynamically generate columns based on data structure
    const columns: ColumnsType<any> = useMemo(() => {
      if (!transformedData || transformedData.length === 0) return [];

      // Get unique keys from the first row, excluding 'key'
      const keys = Object.keys(transformedData[0]).filter(
        (key) => key !== "key"
      );

      return keys.map((key) => ({
        title: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        dataIndex: key,
        key: key,
        render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
        sorter: (a: any, b: any) => {
          // Enhanced sorting logic
          if (Text === null || Text === undefined) return 0;

          if (typeof a[key] === "number" && typeof b[key] === "number") {
            return a[key] - b[key];
          }

          // Convert to string for comparison
          return String(a[key]).localeCompare(String(b[key]));
        },
        ellipsis: true,
      }));
    }, [transformedData]);

    return (
      <Table
        rowKey="key"
        columns={columns}
        dataSource={transformedData}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ["10", "50", "100", "200"],
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            // If pageSize changes, the hook should handle this
          },
        }}
        scroll={{ x: true, y: "calc(100vh - 300px)" }}
        className="w-full"
      />
    );
  }
);

DataTable.displayName = "DataTable";
export default DataTable;
