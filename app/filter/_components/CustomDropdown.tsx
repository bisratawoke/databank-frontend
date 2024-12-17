import { Checkbox, Input, Select, Pagination } from "antd";
import React, { useState, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const CustomDropdown = ({
  items,
  selectedItems,
  onSelect,
  placeholder,
  disabled = false,
  mode = "single",
  enableAdvancedFeatures = false, // New prop to control advanced features
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
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Clear selection
  const handleClear = () => {
    onSelect([]);
  };

  // Advanced sorting and filtering
  const processedItems = useMemo(() => {
    const sortedItems = items
      .sort((a, b) => {
        // Try numeric sorting first, fallback to string comparison
        const numA = Number(a.name);
        const numB = Number(b.name);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return a.name.localeCompare(b.name);
      })
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return sortedItems;
  }, [items, searchTerm]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedItems.slice(startIndex, startIndex + pageSize);
  }, [processedItems, currentPage, pageSize]);

  // Check if all items on current page are selected
  const isCurrentPageAllSelected = useMemo(
    () =>
      enableAdvancedFeatures
        ? paginatedItems.every((item) => selectedItems.includes(item._id))
        : false,
    [paginatedItems, selectedItems, enableAdvancedFeatures]
  );

  // Handle page selection toggle
  const handleCurrentPageSelectToggle = () => {
    if (mode !== "multiple" || !enableAdvancedFeatures) return;

    const currentPageIds = paginatedItems.map((item) => item._id);

    if (isCurrentPageAllSelected) {
      // Remove current page items from selection
      onSelect(selectedItems.filter((id) => !currentPageIds.includes(id)));
    } else {
      // Add current page items to selection, avoiding duplicates
      const newSelectedItems = new Set([
        ...selectedItems,
        ...currentPageIds.filter((id) => !selectedItems.includes(id)),
      ]);
      onSelect(Array.from(newSelectedItems));
    }
  };

  // Handle individual item selection in multiple mode
  //   const handleItemSelect = (itemId: string) => {
  //     if (mode === "single") {
  //       onSelect([itemId]);
  //       return;
  //     }

  //     // Multiple mode
  //     const newSelectedItems = selectedItems.includes(itemId)
  //       ? selectedItems.filter((id) => id !== itemId)
  //       : [...selectedItems, itemId];

  //     onSelect(newSelectedItems);
  //   };

  const handleItemSelect = (itemId: string) => {
    if (mode === "single") {
      // For single mode, directly set the selected item
      onSelect([itemId]);
      setOpen(false); // Close dropdown after selection
      return;
    }

    // Multiple mode logic remains the same
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    onSelect(newSelectedItems);
  };

  return (
    <Select
      mode={mode}
      style={{ width: "100%" }}
      placeholder={placeholder}
      disabled={disabled}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      value={selectedItems}
      onChange={onSelect}
      allowClear
      dropdownRender={(menu) => (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
            }}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              style={{ width: "calc(100% - 150px)", marginRight: 8 }}
            />
            {mode === "multiple" && enableAdvancedFeatures && (
              <Checkbox
                indeterminate={
                  selectedItems.length > 0 &&
                  selectedItems.length < paginatedItems.length
                }
                checked={isCurrentPageAllSelected}
                onChange={handleCurrentPageSelectToggle}
              >
                Select Page
              </Checkbox>
            )}
          </div>

          {menu}

          {enableAdvancedFeatures && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 16px",
              }}
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
        </div>
      )}
    >
      {paginatedItems.map((item) => (
        <Option key={item._id} value={item._id}>
          {mode === "multiple" && (
            <Checkbox
              checked={selectedItems.includes(item._id)}
              onChange={() => handleItemSelect(item._id)}
              style={{ marginRight: 8 }}
            />
          )}
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

export default CustomDropdown;
