"use client";
import React, { useState } from "react";
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
import { Button, Radio, Table } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";

const generateRandomData = () => {
  const months = [10, 20, 30, 40, 50, 60];
  return months.map((month) => ({
    name: month,
    2011: Math.floor(Math.random() * 100),
    2012: Math.floor(Math.random() * 100),
    2013: Math.floor(Math.random() * 100),
  }));
};

const ChartTableComponent = () => {
  const [timeFrame, setTimeFrame] = useState("6Month");
  const [data, setData] = useState(generateRandomData);
  const [view, setView] = useState("chart"); // chart, table, or description view

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
    setData(generateRandomData()); // Update data dynamically when time frame changes
  };

  const handleDownload = () => {
    // Implement download functionality
    alert("Download functionality");
  };

  const handlePrint = () => {
    window.print(); // Opens the browser print dialog
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "2011",
      dataIndex: "2011",
      key: "2011",
    },
    {
      title: "2012",
      dataIndex: "2012",
      key: "2012",
    },
    {
      title: "2013",
      dataIndex: "2013",
      key: "2013",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        margin: "0 auto",
        maxWidth: "1200px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type={view === "chart" ? "primary" : "default"}
            onClick={() => setView("chart")}
          >
            Show as chart
          </Button>
          <Button
            type={view === "table" ? "primary" : "default"}
            onClick={() => setView("table")}
          >
            Show as table
          </Button>
          <Button
            type={view === "description" ? "primary" : "default"}
            onClick={() => setView("description")}
          >
            Description
          </Button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            Download as...
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>

      <Radio.Group
        onChange={handleTimeFrameChange}
        value={timeFrame}
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        <Radio.Button value="1Month">1 Month</Radio.Button>
        <Radio.Button value="3Month">3 Month</Radio.Button>
        <Radio.Button value="6Month">6 Month</Radio.Button>
        <Radio.Button value="1Year">1 Year</Radio.Button>
        <Radio.Button value="2Year">2 Year</Radio.Button>
        <Radio.Button value="5Year">5 Year</Radio.Button>
      </Radio.Group>

      {view === "chart" && (
        <div style={{ marginTop: 40 }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
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
              <Bar dataKey="2011" fill="#8884d8" />
              <Bar dataKey="2012" fill="#82ca9d" />
              <Bar dataKey="2013" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ color: "#8884d8", marginRight: 16 }}>
              General Inflation
            </span>
            <span style={{ color: "#82ca9d", marginRight: 16 }}>
              Food Inflation
            </span>
            <span style={{ color: "#ffc658" }}>Non-Food Inflation</span>
          </div>
        </div>
      )}

      {view === "table" && (
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="name"
          style={{ marginTop: 40 }}
        />
      )}

      {view === "description" && (
        <div style={{ marginTop: 40 }}>
          <h3>Description of Inflation Data</h3>
          <p>
            This section provides a description of the inflation trends,
            including general, food, and non-food inflation...
          </p>
        </div>
      )}
    </div>
  );
};

export default ChartTableComponent;
