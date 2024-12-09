"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { Checkbox } from "antd";
import ChartTableComponent from "@/app/result/ChartTableComponent";
import StepsComponent from "../_components/StepsCompnent/StepsCompnent";
import { useSession } from "next-auth/react";

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

// New interface for selected items per field
interface SelectedItemsState {
  [fieldId: string]: Set<string>;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FilteredReportPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { filterId } = params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChartTable, setShowChartTable] = useState(false);
  const [selectedItemsPerField, setSelectedItemsPerField] =
    useState<SelectedItemsState>({});

  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    if (!filterId) {
      setError("No filter ID provided");
      setLoading(false);
      return;
    }

    //   const fetchReport = async () => {
    //     try {
    //       const response = await fetch(`${API_URL}/portal-reports/${filterId}`);
    //       if (!response.ok) {
    //         throw new Error(`Failed to fetch the report: ${response.statusText}`);
    //       }

    //       const data = await response.json();
    //       console.log("fetchedReprots: ", data);
    //       setReport(data);

    //       // Initialize selected items state for each field
    //       const initialSelectedState: SelectedItemsState = {};
    //       data.fields
    //         .filter((field: Field) => field.filtered)
    //         .forEach((field: Field) => {
    //           initialSelectedState[field._id] = new Set();
    //         });
    //       setSelectedItemsPerField(initialSelectedState);
    //     } catch (err: any) {
    //       setError(err.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchReport();
    // }, [filterId]);

    const fetchReport = async () => {
      try {
        // Use the access token from the session
        const response = await fetch(`${API_URL}/reports/${filterId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`, // Assumes your session includes an accessToken
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch the report: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("fetchedReports: ", data);
        setReport(data);

        // Initialize selected items state for each field
        const initialSelectedState: SelectedItemsState = {};
        data.fields
          .filter((field: Field) => field.filtered)
          .forEach((field: Field) => {
            initialSelectedState[field._id] = new Set();
          });
        setSelectedItemsPerField(initialSelectedState);
      } catch (err: any) {
        setError(err.message);

        // Optional: Handle unauthorized errors
        if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          // Redirect to login or handle token expiration
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filterId, session]); // Add session to dependency array

  const handleSelectAll = (fieldId: string, items: string[]) => {
    setSelectedItemsPerField((prev) => ({
      ...prev,
      [fieldId]: new Set(items),
    }));
  };

  const handleDeselectAll = (fieldId: string) => {
    setSelectedItemsPerField((prev) => ({
      ...prev,
      [fieldId]: new Set(),
    }));
  };

  const handleItemChange = (fieldId: string, item: string) => {
    setSelectedItemsPerField((prev) => {
      const currentFieldSelections = new Set(prev[fieldId]);
      if (currentFieldSelections.has(item)) {
        currentFieldSelections.delete(item);
      } else {
        currentFieldSelections.add(item);
      }
      return {
        ...prev,
        [fieldId]: currentFieldSelections,
      };
    });
  };

  const filteredFields = report?.fields.filter((field) => field.filtered) ?? [];

  const groupedDataItems = filteredFields.reduce((acc, field) => {
    const filteredItemsForField =
      report?.data
        .filter((dataItem) => dataItem.field._id === field._id)
        .map((dataItem) => dataItem.value) ?? [];

    if (!acc[field._id]) {
      acc[field._id] = {
        fieldName: field.name,
        values: new Set(filteredItemsForField),
      };
    } else {
      filteredItemsForField.forEach((value) =>
        acc[field._id].values.add(value)
      );
    }

    return acc;
  }, {} as { [key: string]: { fieldName: string; values: Set<string> } });

  const handleNextClick = () => {
    // Create selectedFilters object with the correct structure
    const filtersSelected = Object.entries(selectedItemsPerField).reduce(
      (acc, [fieldId, selectedValues]) => {
        const field = report?.fields.find((field) => field._id === fieldId);
        if (field) {
          acc[field.name] = Array.from(selectedValues);
        }
        return acc;
      },
      {} as { [fieldName: string]: string[] }
    );

    // Toggle the next component to render and pass props
    console.log("Selected Filters: ", filtersSelected); // Check the structure
    setShowChartTable(true);
    setSelectedFilters(filtersSelected);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin spinning={loading} size="large">
          <div className="p-12">Loading report...</div>
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 font-semibold mb-2">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  if (showChartTable && report) {
    console.log("report: ", report);

    // Render the ChartTableComponent with selected filters and the report data
    return (
      <ChartTableComponent report={report} selectedFilters={selectedFilters} />
    );
  }

  return (
    <>
      <StepsComponent currentStep={1} />

      <div className="w-full flex flex-col gap-4 px-8 items-center justify-center">
        <h1 className="text-xl font-semibold mb-4">
          Reports with Filtered Fields
        </h1>
        {Object.keys(groupedDataItems).length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {Object.entries(groupedDataItems).map(
              ([fieldId, { fieldName, values }]) => (
                <div
                  key={fieldId}
                  className="flex-1 min-w-[300px] max-w-[400px]"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  </h2>
                  <div className="bg-[#2B5BA8] text-white rounded-md h-[400px] flex flex-col">
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between mb-2">
                        <button
                          className="bg-white text-[#2B5BA8] px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                          onClick={() => handleSelectAll(fieldId, [...values])}
                        >
                          Select all
                        </button>
                        <button
                          className="bg-white text-[#2B5BA8] px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                          onClick={() => handleDeselectAll(fieldId)}
                        >
                          Deselect all
                        </button>
                      </div>
                      <div className="text-sm">
                        Selected {selectedItemsPerField[fieldId]?.size ?? 0} of
                        total {values.size}
                      </div>
                    </div>
                    <div className="flex-1 bg-white text-black rounded-md mx-4 mb-4 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {[...values].map((value) => (
                          <Checkbox
                            key={value}
                            checked={selectedItemsPerField[fieldId]?.has(value)}
                            onChange={() => handleItemChange(fieldId, value)}
                            className="w-full hover:bg-gray-50 p-1 rounded"
                          >
                            {value}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p>No reports found with filtered fields.</p>
        )}
        <button
          onClick={handleNextClick}
          className="mt-6 bg-[#2B5BA8] text-white px-4 py-2 rounded hover:bg-[#234a87] transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default FilteredReportPage;
