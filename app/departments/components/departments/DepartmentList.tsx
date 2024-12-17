"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Layout, Badge, Empty, Pagination, Button, Drawer, Input } from "antd";
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Department } from "./types";
import FilterSidebar from "./FilterSidebar";
import FilteredReportPage from "@/app/filter/page";
import Link from "next/link";

const { Sider, Content } = Layout;
const { Search } = Input;

interface DepartmentsListProps {
  departments: Department[];
}

const DepartmentsList: React.FC<DepartmentsListProps> = ({ departments }) => {
  // console.log("fetched departments: ", departments);
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [] as string[],
    categories: [] as string[],
    subcategories: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    if (session === null) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  // Filter change handler
  const handleFilterChange = (
    filterType: "departments" | "categories" | "subcategories",
    id: string
  ) => {
    setSelectedFilters((prev) => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(id)
        ? currentFilter.filter((filterId) => filterId !== id)
        : [...currentFilter, id];

      return {
        ...prev,
        [filterType]: newFilter,
      };
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      departments: [],
      categories: [],
      subcategories: [],
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Navigate to reports page
  // const navigateToReports = () =>
  // departmentId: string,
  // categoryId: string,
  // subcategoryId: string
  // {
  // router.push(
  //   `/departments/reports/${departmentId}/${categoryId}/${subcategoryId}`
  // );
  // router.push(`/filter}`);
  // };

  const navigateToFilterPage = () => {
    router.push("/filter");
  };

  // Search and filter logic
  // const filteredDepartments = useMemo(() => {
  //   // Start with base filtering
  //   let result = departments;

  //   // Apply text search if search term exists
  //   if (searchTerm.trim()) {
  //     const searchTermLower = searchTerm.toLowerCase().trim();
  //     result = result.filter((department) => {
  //       // Check department name
  //       if (department.name.toLowerCase().includes(searchTermLower)) {
  //         return true;
  //       }

  //       // Check categories
  //       const hasMatchingCategory = department.category.some((category) => {
  //         // Check category name
  //         if (category.name.toLowerCase().includes(searchTermLower)) {
  //           return true;
  //         }

  //         // Check subcategories
  //         const hasMatchingSubcategory = category.subcategory.some(
  //           (subcategory) =>
  //             subcategory.name.toLowerCase().includes(searchTermLower)
  //         );

  //         return hasMatchingSubcategory;
  //       });

  //       return hasMatchingCategory;
  //     });
  //   }

  //   // Apply additional filters if any are selected
  //   if (
  //     selectedFilters.departments.length > 0 ||
  //     selectedFilters.categories.length > 0 ||
  //     selectedFilters.subcategories.length > 0
  //   ) {
  //     result = result.filter((department) => {
  //       // If no department filters, or department is in selected filters
  //       const departmentMatch =
  //         selectedFilters.departments.length === 0 ||
  //         selectedFilters.departments.includes(department._id);

  //       // If department matches, filter categories
  //       if (departmentMatch) {
  //         const filteredCategories = department.category.filter((category) => {
  //           const categoryMatch =
  //             selectedFilters.categories.length === 0 ||
  //             selectedFilters.categories.includes(category._id);

  //           // If category matches, filter subcategories
  //           if (categoryMatch) {
  //             const filteredSubcategories = category.subcategory.filter(
  //               (subcategory) =>
  //                 selectedFilters.subcategories.length === 0 ||
  //                 selectedFilters.subcategories.includes(subcategory._id)
  //             );

  //             return filteredSubcategories.length > 0;
  //           }

  //           return false;
  //         });

  //         return filteredCategories.length > 0;
  //       }

  //       return false;
  //     });
  //   }

  //   return result;
  // }, [departments, selectedFilters, searchTerm]);
  const filteredDepartments = useMemo(() => {
    let result = departments;

    // Apply text search if search term exists
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      result = result.filter((department) => {
        // Check department name
        if (department.name.toLowerCase().includes(searchTermLower))
          return true;

        // Check categories
        const hasMatchingCategory = department.category.some((category) => {
          // Check category name
          if (category.name.toLowerCase().includes(searchTermLower))
            return true;

          // Check subcategories
          const hasMatchingSubcategory = category.subcategory.some(
            (subcategory) =>
              subcategory.name.toLowerCase().includes(searchTermLower)
          );

          return hasMatchingSubcategory;
        });

        return hasMatchingCategory;
      });
    }

    // Apply filter selections
    if (
      selectedFilters.departments.length > 0 ||
      selectedFilters.categories.length > 0 ||
      selectedFilters.subcategories.length > 0
    ) {
      result = result.filter((department) => {
        // Department filter
        const departmentMatch =
          selectedFilters.departments.length === 0 ||
          selectedFilters.departments.includes(department._id);

        if (!departmentMatch) return false;

        // Filter categories
        const filteredCategories = department.category.filter((category) => {
          const categoryMatch =
            selectedFilters.categories.length === 0 ||
            selectedFilters.categories.includes(category._id);

          // If category matches, check subcategories
          if (categoryMatch) {
            const filteredSubcategories = category.subcategory.filter(
              (subcategory) =>
                selectedFilters.subcategories.length === 0 ||
                selectedFilters.subcategories.includes(subcategory._id)
            );

            return filteredSubcategories.length > 0;
          }

          return false;
        });

        return filteredCategories.length > 0;
      });
    }

    return result;
  }, [departments, selectedFilters, searchTerm]);

  // console.log("departments: ", departments);

  // console.log("filteredDepartments: ", filteredDepartments);
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Render nothing if no session
  if (session === null) {
    return null;
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setFilterVisible(true)}
          className="shadow-lg"
        >
          Filters
        </Button>
      </div>

      {/* Sidebar for Large Screens */}
      <Sider theme="light" width={300} className="hidden lg:block border-r">
        <FilterSidebar
          departments={departments}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </Sider>

      {/* Mobile Drawer Filter */}
      <Drawer
        title="Filters"
        placement="right"
        closable={true}
        onClose={() => setFilterVisible(false)}
        open={filterVisible}
        className="lg:hidden"
      >
        <FilterSidebar
          departments={departments}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </Drawer>

      {/* Main Content Area */}
      <Content className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <FolderOpenOutlined className="mr-3 text-primary" />
          Departments and Categories
        </h1>

        {/* Search Input */}
        <div className="mb-6">
          <Search
            placeholder="Search departments, categories, subcategories"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {filteredDepartments.length === 0 ? (
          <Empty
            description="No departments found matching your search or filters"
            className="mt-20"
          />
        ) : (
          <>
            {currentItems.map((department) => (
              <div
                key={department._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden"
              >
                {/* Department Header */}
                <div className="bg-gray-50 p-4 font-semibold text-gray-800 grid grid-flow-col justify-between">
                  <div className="flex items-start">
                    <FolderOutlined className="mr-2 text-primary" />
                    <span>{department.name}</span>
                  </div>
                  <div className="place-items-end">
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Department
                    </span>
                  </div>
                </div>

                {/* Categories */}
                {department.category.map((category) => (
                  <div key={category._id} className=" p-4 border-t">
                    <h3 className="text-lg font-medium text-gray-700 mb-3 grid grid-flow-col justify-between">
                      <div className="flex items-start">
                        <FileTextOutlined className="mr-2 text-secondary" />
                        <span className="place-items-start">
                          {category.name}
                        </span>
                      </div>
                      <div className="place-items-end">
                        <span className="justify-end ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Category
                        </span>
                      </div>
                    </h3>

                    {/* Subcategories */}
                    {category.subcategory.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        className="bg-white border-t border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={navigateToFilterPage}
                      >
                        <div className="flex justify-between items-center">
                          {/* Subcategory Name and Tag */}
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-600">
                                {subcategory.name}
                              </span>
                            </div>
                          </div>

                          {/* Reports Badge */}
                          <div className="grid grid-flow-row place-items-end space-x-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full place-items-end">
                              Sub
                            </span>
                            {subcategory.report &&
                            subcategory.report.length > 0 ? (
                              <Badge
                                count={subcategory.report.length}
                                color="#1890ff"
                                style={{ backgroundColor: "#e6f7ff" }}
                              />
                            ) : (
                              <div className="text-gray-400 text-sm">
                                No reports available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={filteredDepartments.length}
                pageSize={itemsPerPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default DepartmentsList;
