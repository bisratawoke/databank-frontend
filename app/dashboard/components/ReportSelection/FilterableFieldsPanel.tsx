import React, { useState } from "react";
import { Select, Input, Typography, Row, Col, Spin, Checkbox } from "antd";
import { useReportFields } from "../../hooks/useReportFields";
import { FieldType } from "../../types/types";

const { Text } = Typography;
const { Option } = Select;

interface FilterableFieldsPanelProps {
  reportId: string;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const FilterableFieldsPanel: React.FC<FilterableFieldsPanelProps> = ({
  reportId,
  onFiltersChange,
}) => {
  const {
    fields,
    isLoading,
    setSearchTerm,
    setAlphabetFilter,
    searchTerm,
    alphabetFilter,
  } = useReportFields(reportId);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );

  const handleFilterChange = (fieldName: string, value: any) => {
    const newFilters = {
      ...selectedFilters,
      [fieldName]: value,
    };
    setSelectedFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const renderFieldFilter = (field: Field) => {
    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={`Select ${field.name}`}
            onChange={(values) => handleFilterChange(field.name, values)}
          >
            {field.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      case FieldType.NUMBER:
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="Min"
                type="number"
                onChange={(e) =>
                  handleFilterChange(`${field.name}_min`, e.target.value)
                }
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Max"
                type="number"
                onChange={(e) =>
                  handleFilterChange(`${field.name}_max`, e.target.value)
                }
              />
            </Col>
          </Row>
        );
      case FieldType.SELECT:
        return (
          <Select
            style={{ width: "100%" }}
            placeholder={`Select ${field.name}`}
            onChange={(value) => handleFilterChange(field.name, value)}
          >
            {field.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      case FieldType.CHECKBOX:
        return (
          <Checkbox
            onChange={(e) => handleFilterChange(field.name, e.target.checked)}
          >
            {field.name}
          </Checkbox>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <Spin fullscreen />;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Search fields"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="A-Z Filter"
            style={{ width: "100%" }}
            onChange={(value) => setAlphabetFilter(value)}
          >
            {Array.from({ length: 26 }, (_, i) =>
              String.fromCharCode(65 + i)
            ).map((letter) => (
              <Option key={letter} value={letter}>
                {letter}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      {fields.map((field) => (
        <div key={field.id} style={{ marginBottom: 16 }}>
          <Text strong>{field.name}</Text>
          {renderFieldFilter(field)}
        </div>
      ))}
    </div>
  );
};
