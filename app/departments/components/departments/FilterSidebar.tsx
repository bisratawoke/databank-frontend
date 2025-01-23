"use client";
import React from "react";
import { Collapse, Checkbox, Button } from "antd";
import {
  FilterOutlined,
  FolderOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { FilterSidebarProps } from "./types";

const { Panel } = Collapse;

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  departments,
  selectedFilters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <FilterOutlined className="mr-2" /> Filters
        </h2>
      </div>

      <Collapse ghost>
        {/* Departments Filter */}
        <Panel
          header={
            <div className="flex items-center">
              <FolderOutlined className="mr-2 text-primary" />
              Departments
            </div>
          }
          key="departments"
        >
          <div className="flex flex-col">
            {departments.map((department) => (
              <Checkbox
                key={department._id}
                checked={selectedFilters.departments.includes(department._id)}
                onChange={() => onFilterChange("departments", department._id)}
                className="mb-2"
              >
                {department.name}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Categories Filter */}
        <Panel
          header={
            <div className="flex items-center">
              <FileTextOutlined className="mr-2 text-secondary" />
              Categories
            </div>
          }
          key="categories"
        >
          <div className="flex flex-col">
            {departments.flatMap((department) =>
              department.category.map((category) => (
                <Checkbox
                  key={category._id}
                  checked={selectedFilters.categories.includes(category._id)}
                  onChange={() => onFilterChange("categories", category._id)}
                  className="mb-2"
                >
                  {category.name}
                </Checkbox>
              ))
            )}
          </div>
        </Panel>

        {/* Subcategories Filter */}
        <Panel header="Subcategories" key="subcategories">
          <div className="flex flex-col">
            {departments.flatMap((department) =>
              department.category.flatMap((category) =>
                category.subcategory.map((subcategory) => (
                  <Checkbox
                    key={subcategory._id}
                    checked={selectedFilters.subcategories.includes(
                      subcategory._id
                    )}
                    onChange={() =>
                      onFilterChange("subcategories", subcategory._id)
                    }
                    className="mb-2"
                  >
                    {subcategory.name}
                  </Checkbox>
                ))
              )
            )}
          </div>
        </Panel>
      </Collapse>

      {/* Reset Filters Button */}
      {(selectedFilters.departments.length > 0 ||
        selectedFilters.categories.length > 0 ||
        selectedFilters.subcategories.length > 0) && (
        <div className="mt-4">
          <Button type="default" onClick={onResetFilters} className="w-full">
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
