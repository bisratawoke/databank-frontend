import React, { useState, useMemo } from "react";
import { Select, Card, Spin, Alert } from "antd";
import { FilterableFieldsPanel } from "./FilterableFieldsPanel";
import { useReportData } from "../../hooks/useReportData";
import DataTable from "../DataVisualization/DataTable";
import { useReports } from "../../hooks/useReports";

const { Option } = Select;

export const ReportSelector: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const { reports, isLoading: isReportsLoading, error } = useReports();
  const {
    data,
    isLoading: isDataLoading,
    page,
    setPage,
    pageSize,
  } = useReportData(selectedReport || "", selectedFilters);

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
  };

  const renderReportOptions = useMemo(() => {
    return reports.map((report) => (
      <Option key={report._id} value={report._id}>
        {report.name}
      </Option>
    ));
  }, [reports]);

  if (isReportsLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card>
      <Select
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Select a Report"
        onChange={(value) => setSelectedReport(value)}
        value={selectedReport}
      >
        {renderReportOptions}
      </Select>

      {selectedReport && (
        <FilterableFieldsPanel
          reportId={selectedReport}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {data && (
        <DataTable
          data={data}
          loading={isDataLoading}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}
    </Card>
  );
};
