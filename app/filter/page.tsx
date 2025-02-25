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
  Report,
} from "./types";
import FieldFilterModal from "./_components/FieldFilterModal";
import CustomDropdown from "./_components/CustomDropdown";
import { useRouter, useSearchParams } from "next/navigation";

const { Panel } = Collapse;
const { Option } = Select;

const FilteredReportPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();

  const departmentId = searchParams.get("departmentId");
  const categoryId = searchParams.get("categoryId");
  const subcategoryId = searchParams.get("subcategoryId");

  // console.log("session: ", session);

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
  const [showMap, setShowMap] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [selectedItemsPerField, setSelectedItemsPerField] =
    useState<SelectedItemsState>({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  const [searchTerms, setSearchTerms] = useState<{ [fieldId: string]: string }>(
    {}
  );

  useEffect(() => {
    if (session === null) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  // Use these IDs to pre-populate the selections

  useEffect(() => {
    if (departments.length > 0 && departmentId) {
      handleDepartmentSelect(departmentId);
    }
  }, [departmentId, departments]);

  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      handleCategorySelect(categoryId);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    if (subCategories.length > 0 && subcategoryId) {
      handleSubCategorySelect(subcategoryId);
    }
  }, [subcategoryId, subCategories]);

  console.log("recieved querys: ", {
    department: departmentId,
    category: categoryId,
    subCategory: subcategoryId,
  });

  // New states for modal and advanced filtering
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(true);
  const [currentFilterField, setCurrentFilterField] = useState<{
    fieldId: string;
    fieldName: string;
    values: string[];
  } | null>(null);

  const [visibleCount, setVisibleCount] = useState(20);

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
  // const handleDepartmentSelect = (departmentId: string) => {
  //   if (!departmentId) {
  //     // If null, reset everything
  //     setSelectedDepartment(null);
  //     setCategories([]);
  //     setSelectedCategory(null);
  //     setSelectedSubCategory(null);
  //     setAvailableReports([]);
  //     setSelectedReport(null);
  //     return;
  //   }

  //   const selectedDept = departments.find((dept) => dept._id === departmentId);
  //   if (selectedDept) {
  //     setSelectedDepartment(departmentId);
  //     setCategories(selectedDept.category);
  //     // Reset subsequent selections
  //     setSelectedCategory(null);
  //     setSelectedSubCategory(null);
  //     setAvailableReports([]);
  //     setSelectedReport(null);
  //   }
  // };

  // // Handle Category Selection
  // const handleCategorySelect = (categoryId: string) => {
  //   if (!categoryId) {
  //     setSelectedCategory(null);
  //     setSelectedSubCategory(null);
  //     setAvailableReports([]);
  //     setSelectedReport(null);
  //     return;
  //   }
  //   const selectedCat = categories.find((cat) => cat._id === categoryId);
  //   if (selectedCat) {
  //     setSelectedCategory(categoryId);
  //     setSubCategories(selectedCat.subcategory);
  //     // Reset subsequent selections
  //     setSelectedSubCategory(null);
  //     setAvailableReports([]);
  //     setSelectedReport(null);
  //   }
  // };

  // // Handle SubCategory Selection
  // const handleSubCategorySelect = (subCategoryId: string) => {
  //   if (!subCategoryId) {
  //     setSelectedSubCategory(null);
  //     setAvailableReports([]);
  //     setSelectedReport(null);
  //     return;
  //   }
  //   const selectedSubCat = subCategories.find(
  //     (subCat) => subCat._id === subCategoryId
  //   );
  //   if (selectedSubCat) {
  //     setSelectedSubCategory(subCategoryId);
  //     // Filter published reports for this subcategory
  //     const reports = selectedSubCat.report.filter(
  //       (report) => report.status === "published"
  //     );
  //     setAvailableReports(reports);
  //     // Reset report selection
  //     setSelectedReport(null);
  //   }
  // };

  const handleDepartmentSelect = (departmentId: string) => {
    if (!departmentId || selectedDepartment === departmentId) return;

    const selectedDept = departments.find((dept) => dept._id === departmentId);
    if (selectedDept) {
      setSelectedDepartment(departmentId);
      setCategories(selectedDept.category);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setAvailableReports([]);
      setSelectedReport(null);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (!categoryId || selectedCategory === categoryId) return;

    const selectedCat = categories.find((cat) => cat._id === categoryId);
    if (selectedCat) {
      setSelectedCategory(categoryId);
      setSubCategories(selectedCat.subcategory);
      setSelectedSubCategory(null);
      setAvailableReports([]);
      setSelectedReport(null);
    }
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    if (!subCategoryId || selectedSubCategory === subCategoryId) return;

    const selectedSubCat = subCategories.find(
      (subCat) => subCat._id === subCategoryId
    );
    if (selectedSubCat) {
      setSelectedSubCategory(subCategoryId);
      const reports = selectedSubCat.report.filter(
        (report) => report.status === "published"
      );
      setAvailableReports(reports);
      setSelectedReport(null);
    }
  };
  // Handle Report Selection
  const handleReportSelect = async (reportId: string) => {
    if (!reportId) {
      setSelectedReport(null);
      return;
    }
    if (!session?.accessToken) {
      setError("Authentication required");
      return;
    }
    setLoading(true);

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
      setFilteredData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // console.log("selectedReport: ", selectedReport);

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

  const applyFilters = () => {
    console.log("selectedReprot in here: ", selectedReport);
    console.log("selectedItemsperFiled: ", selectedItemsPerField);
    const filtersSelected = Object.entries(selectedItemsPerField).reduce(
      (acc, [fieldId, selectedFilter]) => {
        const field = selectedReport?.fields.find((f) => f._id === fieldId);
        if (!field) return acc;

        if (
          selectedFilter.selectedValues &&
          selectedFilter.selectedValues.size > 0
        ) {
          acc[field.name] = Array.from(selectedFilter.selectedValues);
        }

        return acc;
      },
      {} as { [fieldName: string]: string[] }
    );

    console.log("filtersSelected: ", filtersSelected);
    if (Object.keys(filtersSelected).length > 0) {
      setSelectedFilters(filtersSelected);
      setShowChartTable(true);
      setShowMap(true);
      setIsSidebarOpen(false);
    }
  };

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
    // <>
    //   <div className="flex justify-center py-2 bg-gray-100 shadow-md rounded-lg">
    //     <h3 className="text-2xl font-bold text-gray-700 tracking-wide">
    //       Reports & Data
    //     </h3>
    //   </div>
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
              {/* <CustomDropdown
                items={departments}
                selectedItems={selectedDepartment ? [selectedDepartment] : []}
                onSelect={(selectedIds) =>
                  handleDepartmentSelect(selectedIds[0] || null)
                }
                onClear={() => {
                  setSelectedDepartment(null);
                }}
                placeholder="Select Department"
                mode="single"
              />

              <CustomDropdown
                items={categories}
                selectedItems={selectedCategory ? [selectedCategory] : []}
                onSelect={(selectedIds) =>
                  handleCategorySelect(selectedIds[0] || null)
                }
                placeholder="Select Category"
                disabled={!selectedDepartment}
                mode="single"
                onClear={() => {
                  setSelectedCategory(null);
                }}
              />
              {/* Subcategory Dropdown *

              <CustomDropdown
                items={subCategories}
                selectedItems={selectedSubCategory ? [selectedSubCategory] : []}
                onSelect={(selectedIds) =>
                  handleSubCategorySelect(selectedIds[0] || null)
                }
                placeholder="Select Subcategory"
                disabled={!selectedDepartment}
                mode="single"
                onClear={() => {
                  setSelectedSubCategory(null);
                }}
              /> */}

              <CustomDropdown
                items={departments}
                selectedItems={selectedDepartment ? [selectedDepartment] : []}
                onSelect={(selectedIds) =>
                  handleDepartmentSelect(selectedIds[0] || null)
                }
                onClear={() => {
                  setSelectedDepartment(null);
                }}
                placeholder="Select Department"
                mode="single"
              />

              <CustomDropdown
                items={categories}
                selectedItems={selectedCategory ? [selectedCategory] : []}
                onSelect={(selectedIds) =>
                  handleCategorySelect(selectedIds[0] || null)
                }
                placeholder="Select Category"
                disabled={!selectedDepartment}
                mode="single"
                onClear={() => {
                  setSelectedCategory(null);
                }}
              />

              <CustomDropdown
                items={subCategories}
                selectedItems={selectedSubCategory ? [selectedSubCategory] : []}
                onSelect={(selectedIds) =>
                  handleSubCategorySelect(selectedIds[0] || null)
                }
                placeholder="Select Subcategory"
                disabled={!selectedDepartment}
                mode="single"
                onClear={() => {
                  setSelectedSubCategory(null);
                }}
              />

              {/* Available Reports Dropdown */}
              <CustomDropdown
                items={availableReports.map((report) => ({
                  _id: report._id,
                  name: report.name,
                }))} // Pass the items with `_id` and `name`
                selectedItems={selectedReport ? [selectedReport._id] : []} // Pass only the `_id` of the selected report
                onSelect={(selectedIds) =>
                  handleReportSelect(selectedIds[0] || null)
                }
                placeholder="Select Report"
                disabled={!selectedDepartment}
                mode="single"
                enableAdvancedFeatures={true}
                onClear={() => {
                  setSelectedReport(null);
                }}
              />
            </div>

            {/* Existing Filters Section (only show if a report is selected) */}

            {selectedReport && (
              <div className="pl-4 bg-stone-100">
                {/* Label for Report Filters */}
                <h3 className="text-small font-semibold mb-4">
                  Report Filters
                </h3>

                <Collapse
                  accordion
                  defaultActiveKey={[]}
                  expandIcon={({ isActive }) => (
                    <CaretDownOutlined rotate={isActive ? 180 : 0} />
                  )}
                >
                  {Object.entries(groupedDataItems).map(
                    ([fieldId, { fieldName, type, values }]) => {
                      const visibleValues = values.slice(0, visibleCount);
                      const hasMore = values.length > visibleCount;

                      return (
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
                            {/* Select All Checkbox */}
                            <div className="flex justify-between items-center mb-3">
                              {values.length > 0 && (
                                <Checkbox
                                  indeterminate={
                                    selectedItemsPerField[fieldId]
                                      ?.selectedValues.size > 0 &&
                                    selectedItemsPerField[fieldId]
                                      ?.selectedValues.size !== values.length
                                  }
                                  checked={
                                    selectedItemsPerField[fieldId]
                                      ?.selectedValues.size === values.length
                                  }
                                  onChange={() =>
                                    handleDiscreteSelectAll(
                                      fieldId,
                                      selectedItemsPerField[fieldId]
                                        ?.selectedValues.size === values.length
                                        ? []
                                        : values
                                    )
                                  }
                                >
                                  Select All
                                </Checkbox>
                              )}
                            </div>

                            {/* Search Input */}
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

                            {/* Checkbox Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded p-2">
                              {visibleValues
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

                            {/* Expand Button */}
                            {hasMore && (
                              <div className="text-center mt-3">
                                <Button
                                  type="link"
                                  onClick={() =>
                                    setVisibleCount(visibleCount + 20)
                                  }
                                >
                                  Show More
                                </Button>
                              </div>
                            )}
                          </div>
                        </Panel>
                      );
                    }
                  )}
                </Collapse>
              </div>
            )}

            <div className="grid grid-flow-col justify-between">
              {/* Apply Filters Button */}
              <Button
                type="primary"
                onClick={applyFilters}
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
              </Button>
              {/* Clear All Button */}
              <Button
                type="default"
                onClick={() => {
                  setSelectedDepartment(null);
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSelectedReport(null);
                  setAvailableReports([]);
                  setCategories([]);
                  setSubCategories([]);
                }}
                className={`
                  text-red-500 border-red-500 hover:bg-red-50
                   w-full py-3 rounded mt-4
               font-semibold
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  `}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}

      <div
        className={`flex-1 m-auto ${
          !isSidebarOpen ? "w-full" : "w-[70%] m-auto"
        } px-4`}
      >
        {error ? (
          <div className="w-full p-8 text-center">
            <div className="text-red-600 font-semibold mb-2">Error</div>
            <div>{error}</div>
          </div>
        ) : showChartTable && selectedReport ? (
          <>
            <ChartTableComponent
              report={selectedReport}
              selectedFilters={selectedFilters}
            />
          </>
        ) : (
          <div className="text-center  text-gray-700">
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
    // </>
  );
};

export default FilteredReportPage;
