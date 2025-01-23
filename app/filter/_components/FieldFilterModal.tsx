import { Modal, Button, Checkbox, Select, Pagination, Input } from "antd";
import { useState, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";

const FieldFilterModal = ({
  fieldId,
  fieldName,
  values,
  onApply,
}: {
  fieldId: string;
  fieldName: string;
  values: string[];
  onApply: (selectedValues: string[]) => void;
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Sort and filter values
  const sortedFilteredValues = useMemo(
    () =>
      values
        .sort((a, b) => {
          // Try numeric sorting first, fallback to string comparison
          const numA = Number(a);
          const numB = Number(b);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return a.localeCompare(b);
        })
        .filter((value) =>
          value.toLowerCase().includes(localSearch.toLowerCase())
        ),
    [values, localSearch]
  );

  // Paginated values
  const paginatedValues = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedFilteredValues.slice(startIndex, startIndex + pageSize);
  }, [sortedFilteredValues, currentPage, pageSize]);

  // Check if all items on current page are selected
  const isCurrentPageAllSelected = useMemo(
    () => paginatedValues.every((value) => localSelectedValues.includes(value)),
    [paginatedValues, localSelectedValues]
  );

  const handleApply = () => {
    console.log("localSelectedValues");
    onApply(localSelectedValues);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Toggle selection of all items on current page
  const handleCurrentPageSelectToggle = () => {
    if (isCurrentPageAllSelected) {
      // Remove current page items from selection
      setLocalSelectedValues((prev) =>
        prev.filter((val) => !paginatedValues.includes(val))
      );
    } else {
      // Add current page items to selection, avoiding duplicates
      setLocalSelectedValues((prev) => {
        const currentPageSet = new Set(paginatedValues);
        const newSelected = new Set([...prev, ...paginatedValues]);
        return Array.from(newSelected);
      });
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (value: string) => {
    setLocalSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <Modal
      title={`Expand Filter: ${fieldName}`}
      open={true}
      onCancel={() => onApply([])}
      footer={[
        <Button key="cancel" onClick={() => onApply([])}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Confirm ({localSelectedValues.length})
        </Button>,
      ]}
      width="80%"
      style={{ maxHeight: "90vh", overflow: "auto" }}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder={`Search ${fieldName}`}
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
        style={{ marginBottom: 16 }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Checkbox
            indeterminate={
              localSelectedValues.length > 0 &&
              localSelectedValues.length < paginatedValues.length
            }
            checked={isCurrentPageAllSelected}
            onChange={handleCurrentPageSelectToggle}
          >
            Select Page ({paginatedValues.length})
          </Checkbox>

          <Select
            value={pageSize}
            style={{ width: 120 }}
            onChange={handlePageSizeChange}
          >
            {[10, 50, 100, 200, 500].map((size) => (
              <Select.Option key={size} value={size}>
                {size} items
              </Select.Option>
            ))}
          </Select>
        </div>

        <Pagination
          current={currentPage}
          total={sortedFilteredValues.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "8px",
          maxHeight: "50vh",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        {paginatedValues.map((value) => (
          <Checkbox
            key={value}
            checked={localSelectedValues.includes(value)}
            onChange={() => handleCheckboxChange(value)}
            style={{ width: "100%", margin: 0 }}
          >
            {value}
          </Checkbox>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <Pagination
          current={currentPage}
          total={sortedFilteredValues.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Modal>
  );
};

export default FieldFilterModal;
