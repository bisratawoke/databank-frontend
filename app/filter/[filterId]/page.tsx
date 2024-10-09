"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter
import { Spin } from "antd";
import { Checkbox } from "antd"; // Import Checkbox from Ant Design

// Define the type for the field and report data structure
interface Field {
  _id: string;
  name: string;
  type: {
    _id: string;
    name: string;
    description: string;
    exampleValue: string;
  };
  filtered: boolean;
  required: boolean;
  description: string;
  defaultValue: string;
}

interface DataItem {
  _id: string;
  field: Field;
  value: string;
}

interface Report {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  fields: Field[];
  data: DataItem[];
}

const FilteredReportPage = () => {
  const params = useParams(); // Access route parameters
  const { filterId } = params; // Destructure filterId from parameters
  const router = useRouter(); // Initialize the router

  const [report, setReport] = useState<Report | null>(null); // Store a single report
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Track selected items

  useEffect(() => {
    if (!filterId) return; // Ensure filterId is available

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `http://localhost:3016/reports/${filterId}` // Fetch report by filterId
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the report");
        }

        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filterId]);

  if (loading) {
    return <Spin spinning={loading}>Loading report...</Spin>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Function to handle the checkbox selection logic
  const handleSelectAll = (items: string[]) => {
    setSelectedItems(items);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleItemChange = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Get filtered fields
  const filteredFields = report.fields.filter((field) => field.filtered);
  // Map over the data to create items for the checkboxes
  const filteredDataItems = report.data.filter((dataItem) =>
    filteredFields.some((field) => field._id === dataItem.field._id)
  );

  // Handle the next button click
  const handleNextClick = () => {
    router.push("/result"); // Navigate to the /result page
  };

  return (
    <div className="p-4 px-8">
      {" "}
      {/* Add horizontal padding */}
      <h1 className="text-xl font-semibold mb-4">
        Reports with Filtered Fields
      </h1>
      {filteredFields.length > 0 ? (
        filteredFields.map((field) => {
          const correspondingDataItem = filteredDataItems.find(
            (dataItem) => dataItem.field._id === field._id
          );

          // Get value for the checkbox label
          const itemValue = correspondingDataItem
            ? correspondingDataItem.value
            : "";

          return (
            <div
              key={field._id}
              className="p-4 bg-[#2B5BA8] text-white rounded-md w-64 mb-4 space-y-2"
            >
              <h2 className="text-lg font-semibold">{field.name}</h2>
              <div className="flex justify-between mb-2">
                <button
                  className="bg-white text-[#2B5BA8] px-2 py-1 rounded"
                  onClick={() =>
                    handleSelectAll(filteredDataItems.map((item) => item.value))
                  }
                >
                  Select all
                </button>
                <button
                  className="bg-white text-[#2B5BA8] px-2 py-1 rounded"
                  onClick={handleDeselectAll}
                >
                  Deselect all
                </button>
              </div>
              <div className="text-sm mb-2">
                Selected {selectedItems.length} of total{" "}
                {filteredDataItems.length}
              </div>
              <div className="bg-white text-black p-2 rounded-md space-y-1">
                {filteredDataItems.map((dataItem) => (
                  <Checkbox
                    key={dataItem._id}
                    checked={selectedItems.includes(dataItem.value)}
                    onChange={() => handleItemChange(dataItem.value)}
                    className="w-full"
                  >
                    {dataItem.value}
                  </Checkbox>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>No reports found with filtered fields.</p>
      )}
      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className="mt-4 bg-[#2B5BA8] text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default FilteredReportPage;
