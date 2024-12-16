"use client";

import React, { useState, memo } from "react";
import { Tabs } from "antd";
import dynamic from "next/dynamic";

// Dynamically import components for code splitting
const DataTable = dynamic(() => import("./DataVisualization/DataTable"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});
const DataChart = dynamic(() => import("./DataVisualization/DataChart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
});

const { TabPane } = Tabs;

const DataPreview: React.FC = memo(() => {
  const [activeTab, setActiveTab] = useState("table");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="w-full h-full p-4">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="h-full flex flex-col"
      >
        <TabPane tab="Table View" key="table" className="h-full">
          <DataTable />
        </TabPane>
        <TabPane tab="Chart View" key="chart" className="h-full">
          <DataChart />
        </TabPane>
      </Tabs>
    </div>
  );
});

DataPreview.displayName = "DataPreview";

export default DataPreview;
