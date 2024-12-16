"use client";

import React, { memo, useState } from "react";
import { Select, Input, Spin, Card, Typography } from "antd";
import { useReportFields } from "../../hooks/useReportFields";
import { useReports } from "../../hooks/useReports";
import { Field } from "../../types/types";

const { Option } = Select;
const { Text } = Typography;

interface FilterSidebarProps {
  onReportSelect?: (reportId: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = memo(
  ({ onReportSelect }) => {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const { reports, isLoading: isReportsLoading } = useReports();

    console.log("reports fetched: ", reports);
    const { fields, isLoading: isFieldsLoading } = useReportFields(
      selectedReport || ""
    );

    console.log("fields fetched: ", fields);

    const renderFilterComponent = (field: Field) => {
      switch (field.type.name) {
        case "text":
          return (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={`Select ${field.name}`}
            >
              {/* You would typically populate this with unique values from report data */}
            </Select>
          );

        case "number":
          return (
            <div className="flex space-x-2">
              <Input type="number" placeholder="Min" />
              <Input type="number" placeholder="Max" />
            </div>
          );

        default:
          return null;
      }
    };

    const handleReportSelect = (reportId: string) => {
      setSelectedReport(reportId);
      onReportSelect?.(reportId);
    };

    if (isReportsLoading) {
      return (
        <Card>
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        </Card>
      );
    }

    return (
      <Card title="Filters">
        <div className="mb-4">
          <Text strong>Select Report</Text>
          <Select
            style={{ width: "100%" }}
            placeholder="Choose a Report"
            onChange={handleReportSelect}
            value={selectedReport}
          >
            {reports.map((report) => (
              <Option key={report._id} value={report._id}>
                {report.name}
              </Option>
            ))}
          </Select>
        </div>

        {selectedReport && (
          <div>
            {isFieldsLoading ? (
              <Spin size="large" />
            ) : (
              fields
                .filter((field) => field.filtered)
                .map((field) => (
                  <div key={field._id} className="mb-4">
                    <Text strong>{field.name}</Text>
                    {renderFilterComponent(field)}
                  </div>
                ))
            )}
          </div>
        )}
      </Card>
    );
  }
);

FilterSidebar.displayName = "FilterSidebar";
export default FilterSidebar;
