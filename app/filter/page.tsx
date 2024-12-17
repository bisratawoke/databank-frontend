/* eslint-disable */

//!improved onw
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Spin,
  Checkbox,
  Tooltip,
  Input,
  Collapse,
  Tag,
  Select,
  Modal,
  Button,
  Pagination,
} from "antd";
import {
  RightOutlined,
  LeftOutlined,
  SearchOutlined,
  CaretDownOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import ChartTableComponent from "@/app/result/ChartTableComponent";
import {
  Category,
  DataItem,
  Department,
  Field,
  SelectedItemsState,
  SubCategory,
} from "./types";
import FieldFilterModal from "./_components/FieldFilterModal";
import CustomDropdown from "./_components/CustomDropdown";

const { Panel } = Collapse;
const { Option } = Select;

const FilteredReportPage: React.FC = () => {
  const { data: session } = useSession();

  // console.log("session: ", session);

  // Hierarchical Selection States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [availableReports, setAvailableReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Existing Component States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChartTable, setShowChartTable] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [selectedItemsPerField, setSelectedItemsPerField] =
    useState<SelectedItemsState>({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerms, setSearchTerms] = useState<{ [fieldId: string]: string }>(
    {}
  );

  // New states for modal and advanced filtering
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(true);
  const [currentFilterField, setCurrentFilterField] = useState<{
    fieldId: string;
    fieldName: string;
    values: string[];
  } | null>(null);

  const [columnsOrder, setColumnsOrder] = useState<string[]>([]);

  // Fetch Hierarchical Data
  useEffect(() => {
    const fetchHierarchicalData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/departments/all`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const departments = data.departments;
        setDepartments(departments);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHierarchicalData();
  }, []);

  // Handle Department Selection
  const handleDepartmentSelect = (departmentId: string) => {
    const selectedDept = departments.find((dept) => dept._id === departmentId);
    if (selectedDept) {
      setSelectedDepartment(departmentId);
      setCategories(selectedDept.category);
      // Reset subsequent selections
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setAvailableReports([]);
      setSelectedReport(null);
    }
  };

  // Handle Category Selection
  const handleCategorySelect = (categoryId: string) => {
    const selectedCat = categories.find((cat) => cat._id === categoryId);
    if (selectedCat) {
      setSelectedCategory(categoryId);
      setSubCategories(selectedCat.subcategory);
      // Reset subsequent selections
      setSelectedSubCategory(null);
      setAvailableReports([]);
      setSelectedReport(null);
    }
  };

  // Handle SubCategory Selection
  const handleSubCategorySelect = (subCategoryId: string) => {
    const selectedSubCat = subCategories.find(
      (subCat) => subCat._id === subCategoryId
    );
    if (selectedSubCat) {
      setSelectedSubCategory(subCategoryId);
      // Filter published reports for this subcategory
      const reports = selectedSubCat.report.filter(
        (report) => report.status === "published"
      );
      setAvailableReports(reports);
      // Reset report selection
      setSelectedReport(null);
    }
  };

  // Handle Report Selection
  const handleReportSelect = async (reportId: string) => {
    if (!session?.accessToken) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch the report: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("data: ", data);
      setSelectedReport(data);

      // Initialize filter states
      const initialSelectedState: SelectedItemsState = {};
      const initialSearchTerms: { [fieldId: string]: string } = {};

      data.fields
        .filter((field: Field) => field.filtered)
        .forEach((field: Field) => {
          const fieldValues = Array.from(
            new Set(
              data.data
                .filter(
                  (dataItem: DataItem) => dataItem.field._id === field._id
                )
                .map((dataItem: DataItem) => dataItem.value)
            )
          );

          initialSelectedState[field._id] = {
            type: "discrete",
            selectedValues: new Set(),
          };

          initialSearchTerms[field._id] = "";
        });

      setSelectedItemsPerField(initialSelectedState);
      setSearchTerms(initialSearchTerms);
    } catch (err: any) {
      setError(err.message);
    }
  };

  console.log("selectedReport: ", selectedReport);

  const handleColumnsOrder = (order: string[]) => {
    console.log("order: ", order);
    setColumnsOrder(order);
  };
  const handleDiscreteItemChange = (fieldId: string, item: string) => {
    setSelectedItemsPerField((prev) => {
      const currentState = prev[fieldId];
      const currentFieldSelections = new Set(currentState.selectedValues);

      if (currentFieldSelections.has(item)) {
        currentFieldSelections.delete(item);
      } else {
        currentFieldSelections.add(item);
      }

      return {
        ...prev,
        [fieldId]: {
          ...currentState,
          selectedValues: currentFieldSelections,
        },
      };
    });
  };

  const handleSearchChange = (fieldId: string, searchTerm: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [fieldId]: searchTerm.toLowerCase(),
    }));
  };

  const handleDiscreteSelectAll = (fieldId: string, items: string[]) => {
    setSelectedItemsPerField((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        selectedValues: new Set(items),
      },
    }));
  };

  // Grouped Data Items Processing (Similar to previous implementation)
  const groupedDataItems = useMemo(() => {
    if (!selectedReport) return {};

    return (
      selectedReport.fields
        .filter((field) => field.filtered)
        .reduce(
          (acc, field) => {
            const filteredItemsForField = selectedReport.data
              .filter((dataItem) => dataItem.field._id === field._id)
              .map((dataItem) => dataItem.value);

            const numericValues = filteredItemsForField
              .map(Number)
              .filter((v) => !isNaN(v));

            acc[field._id] = {
              fieldName: field.name,
              type:
                numericValues.length === filteredItemsForField.length
                  ? "numeric"
                  : "discrete",
              values: Array.from(
                new Set(
                  numericValues.length === filteredItemsForField.length
                    ? numericValues.map(String)
                    : filteredItemsForField
                )
              ),
            };

            return acc;
          },
          {} as {
            [key: string]: {
              fieldName: string;
              type: "numeric" | "discrete";
              values: string[];
            };
          }
        ) || {}
    );
  }, [selectedReport]);

  // Enhanced Dropdown Component with Alphabetical Sorting and Searching
  // const EnhancedHierarchicalDropdown = ({
  //   items,
  //   selectedItems,
  //   onSelect,
  //   placeholder,
  //   disabled = false,
  //   mode = "single",
  // }: {
  //   items: Array<{ _id: string; name: string }>;
  //   selectedItems: string[];
  //   onSelect: (selectedIds: string[]) => void;
  //   placeholder: string;
  //   disabled?: boolean;
  //   mode?: "single" | "multiple";
  // }) => {
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [open, setOpen] = useState(false);

  //   // Alphabetical sorting and filtering
  //   const processedItems = useMemo(() => {
  //     const sortedItems = items
  //       .sort((a, b) => a.name.localeCompare(b.name))
  //       .filter((item) =>
  //         item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     return sortedItems;
  //   }, [items, searchTerm]);

  //   return (
  //     <Select
  //       mode={mode}
  //       style={{ width: "100%" }}
  //       placeholder={placeholder}
  //       disabled={disabled}
  //       open={open}
  //       onDropdownVisibleChange={(visible) => setOpen(visible)}
  //       value={selectedItems}
  //       onChange={onSelect}
  //       dropdownRender={(menu) => (
  //         <div>
  //           <Input
  //             prefix={<SearchOutlined />}
  //             placeholder="Search..."
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             style={{ margin: "8px 16px", width: "calc(100% - 32px)" }}
  //           />
  //           {menu}
  //         </div>
  //       )}
  //     >
  //       {processedItems.map((item) => (
  //         <Option key={item._id} value={item._id}>
  //           {mode === "multiple" && (
  //             <Checkbox
  //               checked={selectedItems.includes(item._id)}
  //               onChange={() => {}}
  //               style={{ marginRight: 8 }}
  //             />
  //           )}
  //           {item.name}
  //         </Option>
  //       ))}
  //     </Select>
  //   );
  // };

  // Render Loading State
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large">
          <div className="p-12">Loading data...</div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="container flex">
      {/* Collapsible Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[30%] shadow-lg" : "w-14"
        } bg-gray-50 border-r overflow-hidden z-50`}
      >
        {/* Sidebar Toggle */}
        <div className="flex justify-end items-center p-2 bg-[#F4F7F8]">
          <Tooltip
            title={isSidebarOpen ? "Collapse Filters" : "Expand Filters"}
            overlayInnerStyle={{ backgroundColor: "white", color: "black" }}
            overlayClassName="shadow"
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white p-2 rounded-full bg-blue-700 hover:bg-black transition"
            >
              {isSidebarOpen ? <LeftOutlined /> : <RightOutlined />}
            </button>
          </Tooltip>
        </div>

        {/* Filter Content */}
        {isSidebarOpen && (
          <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-72px)]">
            {/* Enhanced Hierarchical Selection Dropdowns */}
            <div className="space-y-4">
              {/* Enhanced Hierarchical Dropdowns */}
              <CustomDropdown
                items={departments}
                selectedItems={selectedDepartment ? [selectedDepartment] : []}
                onSelect={(selectedIds) =>
                  handleDepartmentSelect(selectedIds[0])
                }
                onClear={() => {
                  setSelectedDepartment(null);
                }}
                placeholder="Select Department"
                mode="multiple"
              />

              <CustomDropdown
                items={categories}
                selectedItems={selectedCategory ? [selectedCategory] : []}
                onSelect={(selectedIds) => handleCategorySelect(selectedIds[0])}
                placeholder="Select Category"
                disabled={!selectedDepartment}
                mode="multiple"
                onClear={() => {
                  setSelectedCategory(null);
                }}
              />
              {/* Subcategory Dropdown */}

              <CustomDropdown
                items={subCategories}
                selectedItems={selectedSubCategory ? [selectedSubCategory] : []}
                onSelect={(selectedIds) =>
                  handleSubCategorySelect(selectedIds[0])
                }
                placeholder="Select Subcategory"
                disabled={!selectedDepartment}
                mode="multiple"
                onClear={() => {
                  setSelectedSubCategory(null);
                }}
              />

              {/* Available Reports Dropdown */}
              <CustomDropdown
                items={availableReports}
                selectedItems={selectedReport ? [selectedReport] : []}
                onSelect={(selectedIds) => handleReportSelect(selectedIds[0])}
                placeholder="Select Report"
                disabled={!selectedDepartment}
                mode="multiple"
                enableAdvancedFeatures={true}
                onClear={() => {
                  setSelectedReport(null);
                }}
              />
            </div>

            {/* Existing Filters Section (only show if a report is selected) */}

            {selectedReport && (
              <Collapse
                accordion
                defaultActiveKey={[]}
                expandIcon={({ isActive }) => (
                  <CaretDownOutlined rotate={isActive ? 180 : 0} />
                )}
              >
                {Object.entries(groupedDataItems).map(
                  ([fieldId, { fieldName, type, values }]) => (
                    <Panel
                      header={
                        <div className="flex justify-between items-center">
                          <span>{fieldName}</span>
                          <Tooltip title="Expand Filter">
                            <Button
                              icon={<ExpandOutlined />}
                              type="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentFilterField({
                                  fieldId,
                                  fieldName,
                                  values,
                                });
                                setIsFilterModalVisible(true);
                              }}
                            />
                          </Tooltip>
                        </div>
                      }
                      key={fieldId}
                      className="text-gray-700"
                    >
                      <div>
                        {/* Select All Checkbox  */}
                        <div className="flex justify-between items-center mb-3">
                          {values.length > 0 && (
                            <Checkbox
                              indeterminate={
                                selectedItemsPerField[fieldId]?.selectedValues
                                  .size > 0 &&
                                selectedItemsPerField[fieldId]?.selectedValues
                                  .size !== values.length
                              }
                              checked={
                                selectedItemsPerField[fieldId]?.selectedValues
                                  .size === values.length
                              }
                              onChange={() =>
                                handleDiscreteSelectAll(
                                  fieldId,
                                  selectedItemsPerField[fieldId]?.selectedValues
                                    .size === values.length
                                    ? []
                                    : values
                                )
                              }
                            >
                              Select All
                            </Checkbox>
                          )}
                        </div>

                        {/* Search Input  */}
                        <div className="relative mb-3">
                          <Input
                            placeholder={`Search ${fieldName}`}
                            value={searchTerms[fieldId] || ""}
                            onChange={(e) =>
                              handleSearchChange(fieldId, e.target.value)
                            }
                            prefix={
                              <SearchOutlined className="text-gray-400" />
                            }
                            className="rounded-md"
                          />
                        </div>

                        {/* Checkbox Grid  */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded p-2">
                          {values
                            .filter((value) =>
                              value
                                .toLowerCase()
                                .includes(
                                  (searchTerms[fieldId] || "").toLowerCase()
                                )
                            )
                            .map((value) => (
                              <Checkbox
                                key={value}
                                checked={selectedItemsPerField[
                                  fieldId
                                ]?.selectedValues?.has(value)}
                                onChange={() =>
                                  handleDiscreteItemChange(fieldId, value)
                                }
                                className="p-2 hover:bg-gray-100 flex items-center"
                              >
                                <span className="text-sm text-gray-600">
                                  {value}
                                </span>
                              </Checkbox>
                            ))}
                        </div>
                      </div>
                    </Panel>
                  )
                )}
              </Collapse>
            )}

            {/* Apply Filters Button */}
            <button
              onClick={() => {
                setShowChartTable(true);
                setIsSidebarOpen(false);
              }}
              disabled={Object.values(selectedItemsPerField).every(
                (selections) => selections.selectedValues.size === 0
              )}
              className={`
                  w-full py-3 rounded mt-4
                  bg-[#2B5BA8] text-white font-semibold
                  hover:bg-[#234a87]
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-4">
        {error ? (
          <div className="w-full p-8 text-center">
            <div className="text-red-600 font-semibold mb-2">Error</div>
            <div>{error}</div>
          </div>
        ) : showChartTable && selectedReport ? (
          <ChartTableComponent
            report={selectedReport}
            selectedFilters={selectedFilters}
            columnsOrder={columnsOrder}
          />
        ) : (
          <div className="text-center justify-items-center align-middle text-gray-500">
            Select a report to view its data.
          </div>
        )}
      </div>
      {/* Expanded Filter Modal */}
      {isFilterModalVisible && currentFilterField && (
        <FieldFilterModal
          fieldId={currentFilterField.fieldId}
          fieldName={currentFilterField.fieldName}
          values={currentFilterField.values}
          onApply={(selectedValues) => {
            setSelectedItemsPerField((prev) => ({
              ...prev,
              [currentFilterField.fieldId]: {
                type: "discrete",
                selectedValues: new Set(selectedValues),
              },
            }));
            setIsFilterModalVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default FilteredReportPage;
