import { Collapse, Checkbox, Input, Pagination } from "antd";
import React, { useState, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const CustomCollapse = ({
  items,
  selectedItems,
  onSelect,
  placeholder,
  disabled = false,
  mode = "single",
  enableAdvancedFeatures = false,
}: {
  items: Array<{ _id: string; name: string }>;
  selectedItems: string[];
  onSelect: (selectedIds: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  mode?: "single" | "multiple";
  enableAdvancedFeatures?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const processedItems = useMemo(() => {
    const sortedItems = items
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return sortedItems;
  }, [items, searchTerm]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedItems.slice(startIndex, startIndex + pageSize);
  }, [processedItems, currentPage, pageSize]);

  const handleItemSelect = (itemId: string) => {
    if (mode === "single") {
      onSelect(selectedItems.includes(itemId) ? [] : [itemId]); // Deselect if already selected
      return;
    }

    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId) // Remove if selected
      : [...selectedItems, itemId]; // Add if not selected

    onSelect(newSelectedItems);
  };

  const handleCurrentPageSelectToggle = () => {
    if (mode !== "multiple" || !enableAdvancedFeatures) return;

    const currentPageIds = paginatedItems.map((item) => item._id);
    const isCurrentPageAllSelected = paginatedItems.every((item) =>
      selectedItems.includes(item._id)
    );

    if (isCurrentPageAllSelected) {
      onSelect(selectedItems.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelectedItems = new Set([
        ...selectedItems,
        ...currentPageIds.filter((id) => !selectedItems.includes(id)),
      ]);
      onSelect(Array.from(newSelectedItems));
    }
  };

  return (
    <Collapse disabled={disabled} defaultActiveKey={[1]}>
      <Panel
        header={
          selectedItems.length > 0
            ? items
                .filter((item) => selectedItems.includes(item._id))
                .map((item) => item.name)
                .join(", ")
            : placeholder
        }
        // if placeholder apply not stile if seleectedItem add blue background
        style={{
          backgroundColor: selectedItems.length > 0 ? "#1890ff" : "",
        }}
        key="1"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "calc(100% - 150px)", marginRight: 8 }}
          />
          {/* {mode === "single" && enableAdvancedFeatures && (
            <Checkbox
              indeterminate={
                selectedItems.length > 0 &&
                selectedItems.length < paginatedItems.length
              }
              checked={paginatedItems.every((item) =>
                selectedItems.includes(item._id)
              )}
              onChange={handleCurrentPageSelectToggle}
            >
              Select Page
            </Checkbox>
          )} */}
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 0",
                backgroundColor: selectedItems.includes(item._id)
                  ? "rgba(24, 144, 255, 0.1)"
                  : "transparent",
                borderRadius: "4px",
              }}
            >
              <Checkbox
                disabled={mode === "single"}
                checked={selectedItems.includes(item._id)}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  cursor: "pointer",
                  flex: 1,
                  color: selectedItems.includes(item._id) ? "#1890ff" : "#000",
                }}
                onClick={() => handleItemSelect(item._id)}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {enableAdvancedFeatures && (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
          >
            <Pagination
              current={currentPage}
              total={processedItems.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger
              pageSizeOptions={[10, 50, 100, 200, 500]}
              onShowSizeChange={(_, size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </Panel>
    </Collapse>
  );
};

export default CustomCollapse;
