/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { memo, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDataFetching } from "../../hooks/useReports";
import { useFilterState } from "../../hooks/useFilterState";

const DataChart: React.FC = memo(() => {
  const { filters } = useFilterState();
  const { data, isLoading, isError } = useDataFetching({ filters });

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Assuming we want to chart numeric columns
    const numericColumns = Object.keys(data[0]).filter(
      (key) => typeof data[0][key] === "number"
    );

    return data.map((item: any) => {
      const chartItem: any = { name: item.id || "Unknown" };
      numericColumns.forEach((col) => {
        chartItem[col] = item[col];
      });
      return chartItem;
    });
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;
  if (isError) return <div>Error loading chart data</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(chartData[0] || {})
          .filter((key) => key !== "name")
          .map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(${(index * 360) / 5}, 70%, 50%)`}
              activeDot={{ r: 8 }}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

DataChart.displayName = "DataChart";

export default DataChart;
