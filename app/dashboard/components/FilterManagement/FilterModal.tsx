"use client";

import React, { memo, useState, useMemo } from "react";
import { Modal, Button, Tag } from "antd";
import { useFilterState } from "../../hooks/useFilterState";

const FilterModal: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const { filterConfig, filterState, updateFilter } = useFilterState();

  // Determine mandatory filters that are not selected
  const mandatoryFiltersStatus = useMemo(() => {
    return filterConfig.filter(
      (filter) =>
        filter.mandatory && filterState.selectedFilters[filter.id] === undefined
    );
  }, [filterConfig, filterState]);

  const handleApplyFilters = () => {
    // Validate mandatory filters
    if (mandatoryFiltersStatus.length > 0) {
      Modal.error({
        title: "Incomplete Filters",
        content: "Please select all mandatory filters before applying.",
      });
      return;
    }

    // Perform data fetch or any other apply logic
    console.log("Applying filters:", filterState.selectedFilters);
    setIsVisible(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        View Filters
      </Button>

      <Modal
        title="Selected Filters"
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={handleApplyFilters}
            disabled={mandatoryFiltersStatus.length > 0}
          >
            Apply Filters
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <h3>Mandatory Filters</h3>
          {filterConfig.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between mb-2"
            >
              <span>{filter.name}</span>
              <Tag
                color={
                  filterState.selectedFilters[filter.id] !== undefined
                    ? "green"
                    : "red"
                }
              >
                {filterState.selectedFilters[filter.id] !== undefined
                  ? "Selected"
                  : "Pending"}
              </Tag>
            </div>
          ))}

          {mandatoryFiltersStatus.length > 0 && (
            <div className="text-red-500 mt-4">
              Please complete all mandatory filters before applying.
            </div>
          )}
        </div>
      </Modal>
    </>
  );
});

FilterModal.displayName = "FilterModal";
export default FilterModal;
