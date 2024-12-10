// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Spin } from "antd";
// import { Checkbox } from "antd";
// import ChartTableComponent from "@/app/result/ChartTableComponent";
// import StepsComponent from "../_components/StepsCompnent/StepsCompnent";
// import { useSession } from "next-auth/react";

// interface Field {
//   _id: string;
//   name: string;
//   type: {
//     _id: string;
//     name: string;
//     description: string;
//     exampleValue: string;
//   };
//   filtered: boolean;
//   required: boolean;
//   description: string;
//   defaultValue: string;
// }

// interface DataItem {
//   _id: string;
//   field: Field;
//   value: string;
// }

// interface Report {
//   _id: string;
//   name: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   fields: Field[];
//   data: DataItem[];
// }

// // New interface for selected items per field
// interface SelectedItemsState {
//   [fieldId: string]: Set<string>;
// }
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const FilteredReportPage = () => {
//   const { data: session } = useSession();
//   const params = useParams();
//   const { filterId } = params;

//   const [report, setReport] = useState<Report | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showChartTable, setShowChartTable] = useState(false);
//   const [selectedItemsPerField, setSelectedItemsPerField] =
//     useState<SelectedItemsState>({});

//   const [selectedFilters, setSelectedFilters] = useState({});

//   useEffect(() => {
//     if (!filterId) {
//       setError("No filter ID provided");
//       setLoading(false);
//       return;
//     }

//     //   const fetchReport = async () => {
//     //     try {
//     //       const response = await fetch(`${API_URL}/portal-reports/${filterId}`);
//     //       if (!response.ok) {
//     //         throw new Error(`Failed to fetch the report: ${response.statusText}`);
//     //       }

//     //       const data = await response.json();
//     //       console.log("fetchedReprots: ", data);
//     //       setReport(data);

//     //       // Initialize selected items state for each field
//     //       const initialSelectedState: SelectedItemsState = {};
//     //       data.fields
//     //         .filter((field: Field) => field.filtered)
//     //         .forEach((field: Field) => {
//     //           initialSelectedState[field._id] = new Set();
//     //         });
//     //       setSelectedItemsPerField(initialSelectedState);
//     //     } catch (err: any) {
//     //       setError(err.message);
//     //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };

//     //   fetchReport();
//     // }, [filterId]);

//     const fetchReport = async () => {
//       try {
//         // Use the access token from the session
//         const response = await fetch(`${API_URL}/reports/${filterId}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${session?.accessToken}`, // Assumes your session includes an accessToken
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch the report: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log("fetchedReports: ", data);
//         setReport(data);

//         // Initialize selected items state for each field
//         const initialSelectedState: SelectedItemsState = {};
//         data.fields
//           .filter((field: Field) => field.filtered)
//           .forEach((field: Field) => {
//             initialSelectedState[field._id] = new Set();
//           });
//         setSelectedItemsPerField(initialSelectedState);
//       } catch (err: any) {
//         setError(err.message);

//         // Optional: Handle unauthorized errors
//         if (
//           err.message.includes("401") ||
//           err.message.includes("Unauthorized")
//         ) {
//           // Redirect to login or handle token expiration
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [filterId, session]); // Add session to dependency array

//   const handleSelectAll = (fieldId: string, items: string[]) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(items),
//     }));
//   };

//   const handleDeselectAll = (fieldId: string) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(),
//     }));
//   };

//   const handleItemChange = (fieldId: string, item: string) => {
//     setSelectedItemsPerField((prev) => {
//       const currentFieldSelections = new Set(prev[fieldId]);
//       if (currentFieldSelections.has(item)) {
//         currentFieldSelections.delete(item);
//       } else {
//         currentFieldSelections.add(item);
//       }
//       return {
//         ...prev,
//         [fieldId]: currentFieldSelections,
//       };
//     });
//   };

//   const filteredFields = report?.fields.filter((field) => field.filtered) ?? [];

//   const groupedDataItems = filteredFields.reduce((acc, field) => {
//     const filteredItemsForField =
//       report?.data
//         .filter((dataItem) => dataItem.field._id === field._id)
//         .map((dataItem) => dataItem.value) ?? [];

//     if (!acc[field._id]) {
//       acc[field._id] = {
//         fieldName: field.name,
//         values: new Set(filteredItemsForField),
//       };
//     } else {
//       filteredItemsForField.forEach((value) =>
//         acc[field._id].values.add(value)
//       );
//     }

//     return acc;
//   }, {} as { [key: string]: { fieldName: string; values: Set<string> } });

//   const handleNextClick = () => {
//     // Create selectedFilters object with the correct structure
//     const filtersSelected = Object.entries(selectedItemsPerField).reduce(
//       (acc, [fieldId, selectedValues]) => {
//         const field = report?.fields.find((field) => field._id === fieldId);
//         if (field) {
//           acc[field.name] = Array.from(selectedValues);
//         }
//         return acc;
//       },
//       {} as { [fieldName: string]: string[] }
//     );

//     // Toggle the next component to render and pass props
//     console.log("Selected Filters: ", filtersSelected); // Check the structure
//     setShowChartTable(true);
//     setSelectedFilters(filtersSelected);
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         <Spin spinning={loading} size="large">
//           <div className="p-12">Loading report...</div>
//         </Spin>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full p-8 text-center">
//         <div className="text-red-600 font-semibold mb-2">Error</div>
//         <div>{error}</div>
//       </div>
//     );
//   }

//   if (showChartTable && report) {
//     console.log("report: ", report);

//     // Render the ChartTableComponent with selected filters and the report data
//     return (
//       <ChartTableComponent report={report} selectedFilters={selectedFilters} />
//     );
//   }

//   return (
//     <>
//       <StepsComponent currentStep={1} />

//       <div className="w-full flex flex-col gap-4 px-8 items-center justify-center">
//         <h1 className="text-xl font-semibold mb-4">
//           Reports with Filtered Fields
//         </h1>
//         {Object.keys(groupedDataItems).length > 0 ? (
//           <div className="flex flex-wrap gap-6">
//             {Object.entries(groupedDataItems).map(
//               ([fieldId, { fieldName, values }]) => (
//                 <div
//                   key={fieldId}
//                   className="flex-1 min-w-[300px] max-w-[400px]"
//                 >
//                   <h2 className="text-lg font-semibold mb-2">
//                     {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
//                   </h2>
//                   <div className="bg-[#2B5BA8] text-white rounded-md h-[400px] flex flex-col">
//                     <div className="p-4 space-y-2">
//                       <div className="flex justify-between mb-2">
//                         <button
//                           className="bg-white text-[#2B5BA8] px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
//                           onClick={() => handleSelectAll(fieldId, [...values])}
//                         >
//                           Select all
//                         </button>
//                         <button
//                           className="bg-white text-[#2B5BA8] px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
//                           onClick={() => handleDeselectAll(fieldId)}
//                         >
//                           Deselect all
//                         </button>
//                       </div>
//                       <div className="text-sm">
//                         Selected {selectedItemsPerField[fieldId]?.size ?? 0} of
//                         total {values.size}
//                       </div>
//                     </div>
//                     <div className="flex-1 bg-white text-black rounded-md mx-4 mb-4 overflow-y-auto">
//                       <div className="p-2 space-y-1">
//                         {[...values].map((value) => (
//                           <Checkbox
//                             key={value}
//                             checked={selectedItemsPerField[fieldId]?.has(value)}
//                             onChange={() => handleItemChange(fieldId, value)}
//                             className="w-full hover:bg-gray-50 p-1 rounded"
//                           >
//                             {value}
//                           </Checkbox>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             )}
//           </div>
//         ) : (
//           <p>No reports found with filtered fields.</p>
//         )}
//         <button
//           onClick={handleNextClick}
//           className="mt-6 bg-[#2B5BA8] text-white px-4 py-2 rounded hover:bg-[#234a87] transition-colors"
//         >
//           Next
//         </button>
//       </div>
//     </>
//   );
// };

// export default FilteredReportPage;

// ! improving the ui
// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Modal, Checkbox, Spin, Tooltip, Empty } from "antd";
// import {
//   FilterOutlined,
//   CheckCircleOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import ChartTableComponent from "@/app/result/ChartTableComponent";

// // Interfaces (keep existing interfaces from previous implementation)
// interface Field {
//   _id: string;
//   name: string;
//   type: {
//     _id: string;
//     name: string;
//     description: string;
//     exampleValue: string;
//   };
//   filtered: boolean;
//   required: boolean;
//   description: string;
//   defaultValue: string;
// }

// interface DataItem {
//   _id: string;
//   field: Field;
//   value: string;
// }

// interface Report {
//   _id: string;
//   name: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   fields: Field[];
//   data: DataItem[];
// }

// interface SelectedItemsState {
//   [fieldId: string]: Set<string>;
// }

// const FilteredReportPage: React.FC = () => {
//   const { data: session } = useSession();
//   const params = useParams();
//   const { filterId } = params;

//   // State Management
//   const [report, setReport] = useState<Report | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showChartTable, setShowChartTable] = useState(false);
//   const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

//   // Filter States
//   const [selectedItemsPerField, setSelectedItemsPerField] =
//     useState<SelectedItemsState>({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [searchTerms, setSearchTerms] = useState<{ [fieldId: string]: string }>(
//     {}
//   );

//   // Fetch Report Data
//   useEffect(() => {
//     const fetchReport = async () => {
//       if (!filterId || !session?.accessToken) return;

//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/reports/${filterId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${session.accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch the report: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setReport(data);

//         // Initialize filter states
//         const initialSelectedState: SelectedItemsState = {};
//         const initialSearchTerms: { [fieldId: string]: string } = {};

//         data.fields
//           .filter((field: Field) => field.filtered)
//           .forEach((field: Field) => {
//             initialSelectedState[field._id] = new Set();
//             initialSearchTerms[field._id] = "";
//           });

//         setSelectedItemsPerField(initialSelectedState);
//         setSearchTerms(initialSearchTerms);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [filterId, session]);

//   // Grouped Data Items
//   const groupedDataItems =
//     report?.fields
//       .filter((field) => field.filtered)
//       .reduce((acc, field) => {
//         const filteredItemsForField =
//           report?.data
//             .filter((dataItem) => dataItem.field._id === field._id)
//             .map((dataItem) => dataItem.value) ?? [];

//         acc[field._id] = {
//           fieldName: field.name,
//           values: new Set(filteredItemsForField),
//         };

//         return acc;
//       }, {} as { [key: string]: { fieldName: string; values: Set<string> } }) ||
//     {};

//   // Handler Functions
//   const handleSelectAll = (fieldId: string, items: string[]) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(items),
//     }));
//   };

//   const handleDeselectAll = (fieldId: string) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(),
//     }));
//   };

//   const handleItemChange = (fieldId: string, item: string) => {
//     setSelectedItemsPerField((prev) => {
//       const currentFieldSelections = new Set(prev[fieldId]);
//       if (currentFieldSelections.has(item)) {
//         currentFieldSelections.delete(item);
//       } else {
//         currentFieldSelections.add(item);
//       }
//       return {
//         ...prev,
//         [fieldId]: currentFieldSelections,
//       };
//     });
//   };

//   const handleSearchChange = (fieldId: string, searchTerm: string) => {
//     setSearchTerms((prev) => ({
//       ...prev,
//       [fieldId]: searchTerm.toLowerCase(),
//     }));
//   };

//   const applyFilters = () => {
//     const filtersSelected = Object.entries(selectedItemsPerField).reduce(
//       (acc, [fieldId, selectedValues]) => {
//         const field = report?.fields.find((field) => field._id === fieldId);
//         if (field && selectedValues.size > 0) {
//           acc[field.name] = Array.from(selectedValues);
//         }
//         return acc;
//       },
//       {} as { [fieldName: string]: string[] }
//     );

//     // Only proceed if filters are selected
//     if (Object.keys(filtersSelected).length > 0) {
//       setSelectedFilters(filtersSelected);
//       setShowChartTable(true);
//     }
//   };

//   // Render Loading State
//   if (loading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         <Spin size="large">
//           <div className="p-12">Loading report...</div>
//         </Spin>
//       </div>
//     );
//   }

//   // Render Error State
//   if (error) {
//     return (
//       <div className="w-full p-8 text-center">
//         <div className="text-red-600 font-semibold mb-2">Error</div>
//         <div>{error}</div>
//       </div>
//     );
//   }

//   // Render Chart Table if Filters are Selected
//   if (showChartTable && report) {
//     return (
//       <ChartTableComponent report={report} selectedFilters={selectedFilters} />
//     );
//   }

//   return (
//     <div className="w-full h-screen flex">
//       {/* Left Side Filter Launcher */}
//       <div className="w-16 bg-[#2B5BA8] flex flex-col items-center pt-8">
//         <Tooltip title="Open Filters" placement="right">
//           <button
//             onClick={() => setIsFilterModalVisible(true)}
//             className="text-white p-2 rounded-full hover:bg-white/20 transition"
//           >
//             <FilterOutlined className="text-2xl" />
//           </button>
//         </Tooltip>
//       </div>

//       {/* Main Content Placeholder */}
//       <div className="flex-1 bg-gray-100 flex items-center justify-center">
//         <Empty
//           description="Select filters to view report"
//           className="text-gray-500"
//         />
//       </div>

//       {/* Filter Modal */}
//       <Modal
//         title="Filter Reports"
//         open={isFilterModalVisible}
//         onCancel={() => setIsFilterModalVisible(false)}
//         footer={[
//           <button
//             key="apply"
//             onClick={() => {
//               applyFilters();
//               setIsFilterModalVisible(false);
//             }}
//             disabled={Object.values(selectedItemsPerField).every(
//               (selections) => selections.size === 0
//             )}
//             className="
//               w-full py-3 rounded
//               bg-[#2B5BA8] text-white
//               hover:bg-[#234a87]
//               transition-colors
//               disabled:opacity-50 disabled:cursor-not-allowed
//             "
//           >
//             Apply Filters
//           </button>,
//         ]}
//         width="80%"
//         centered
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Object.entries(groupedDataItems).map(
//             ([fieldId, { fieldName, values }]) => (
//               <div key={fieldId} className="bg-white rounded-lg shadow-md p-4">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold capitalize">
//                     {fieldName}
//                   </h3>
//                   <div className="flex space-x-2">
//                     <Tooltip title="Select All">
//                       <button
//                         onClick={() => handleSelectAll(fieldId, [...values])}
//                         className="text-green-500 hover:bg-green-50 p-1 rounded"
//                       >
//                         <CheckCircleOutlined />
//                       </button>
//                     </Tooltip>
//                   </div>
//                 </div>

//                 {/* Search Input */}
//                 <div className="relative mb-3">
//                   <input
//                     type="text"
//                     placeholder={`Search ${fieldName}`}
//                     value={searchTerms[fieldId] || ""}
//                     onChange={(e) =>
//                       handleSearchChange(fieldId, e.target.value)
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                   <SearchOutlined className="absolute right-3 top-3 text-gray-500" />
//                 </div>

//                 {/* Selection Status */}
//                 <div className="text-sm text-gray-500 mb-2">
//                   Selected: {selectedItemsPerField[fieldId]?.size ?? 0} of{" "}
//                   {values.size}
//                 </div>

//                 {/* Filtered Checkbox List */}
//                 <div className="max-h-64 overflow-y-auto border rounded">
//                   {[...values]
//                     .filter((value) =>
//                       value.toLowerCase().includes(searchTerms[fieldId] || "")
//                     )
//                     .map((value) => (
//                       <Checkbox
//                         key={value}
//                         checked={selectedItemsPerField[fieldId]?.has(value)}
//                         onChange={() => handleItemChange(fieldId, value)}
//                         className="w-full p-2 hover:bg-gray-50"
//                       >
//                         {value}
//                       </Checkbox>
//                     ))}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FilteredReportPage;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Layout,
//   Menu,
//   Button,
//   Checkbox,
//   Input,
//   Spin,
//   Drawer,
//   Tag,
//   Divider,
// } from "antd";
// import {
//   FilterOutlined,
//   CloseOutlined,
//   CheckOutlined,
//   ReloadOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { FaFilter } from "react-icons/fa";
// import { useSession } from "next-auth/react";
// import ChartTableComponent from "@/app/result/ChartTableComponent";
// import StepsComponent from "../_components/StepsCompnent/StepsCompnent";

// // Existing interfaces remain the same
// interface Field {
//   _id: string;
//   name: string;
//   type: {
//     _id: string;
//     name: string;
//     description: string;
//     exampleValue: string;
//   };
//   filtered: boolean;
//   required: boolean;
//   description: string;
//   defaultValue: string;
// }

// interface DataItem {
//   _id: string;
//   field: Field;
//   value: string;
// }

// interface Report {
//   _id: string;
//   name: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   fields: Field[];
//   data: DataItem[];
// }

// interface SelectedItemsState {
//   [fieldId: string]: Set<string>;
// }

// const { Sider, Content } = Layout;

// const FilteredReportPage: React.FC = () => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const params = useParams();
//   const { filterId } = params;

//   const [report, setReport] = useState<Report | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showChartTable, setShowChartTable] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);

//   const [selectedItemsPerField, setSelectedItemsPerField] =
//     useState<SelectedItemsState>({});
//   const [selectedFilters, setSelectedFilters] = useState<{
//     [key: string]: string[];
//   }>({});

//   // New state for search functionality
//   const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});

//   // Fetch report logic
//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/reports/${filterId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${session?.accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch the report: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setReport(data);

//         // Initialize selected items and search terms
//         const initialSelectedState: SelectedItemsState = {};
//         const initialSearchTerms: { [key: string]: string } = {};

//         data.fields
//           .filter((field: Field) => field.filtered)
//           .forEach((field: Field) => {
//             initialSelectedState[field._id] = new Set();
//             initialSearchTerms[field._id] = "";
//           });

//         setSelectedItemsPerField(initialSelectedState);
//         setSearchTerms(initialSearchTerms);
//       } catch (err: any) {
//         setError(err.message);
//         if (
//           err.message.includes("401") ||
//           err.message.includes("Unauthorized")
//         ) {
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (filterId && session) {
//       fetchReport();
//     }
//   }, [filterId, session]);

//   // Selection logic methods
//   const handleSelectAll = (fieldId: string, items: string[]) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(items),
//     }));
//   };

//   const handleDeselectAll = (fieldId: string) => {
//     setSelectedItemsPerField((prev) => ({
//       ...prev,
//       [fieldId]: new Set(),
//     }));
//   };

//   const handleItemChange = (fieldId: string, item: string) => {
//     setSelectedItemsPerField((prev) => {
//       const currentFieldSelections = new Set(prev[fieldId]);
//       currentFieldSelections.has(item)
//         ? currentFieldSelections.delete(item)
//         : currentFieldSelections.add(item);

//       return {
//         ...prev,
//         [fieldId]: currentFieldSelections,
//       };
//     });
//   };

//   // Prepare grouped data with search functionality
//   const prepareGroupedDataItems = () => {
//     const filteredFields =
//       report?.fields.filter((field) => field.filtered) ?? [];

//     return filteredFields.reduce((acc, field) => {
//       const filteredItemsForField =
//         report?.data
//           .filter((dataItem) => dataItem.field._id === field._id)
//           .map((dataItem) => dataItem.value) ?? [];

//       const searchTerm = searchTerms[field._id]?.toLowerCase() || "";
//       const filteredValues = filteredItemsForField.filter((value) =>
//         value.toLowerCase().includes(searchTerm)
//       );

//       acc[field._id] = {
//         fieldName: field.name,
//         values: new Set(filteredValues),
//       };

//       return acc;
//     }, {} as { [key: string]: { fieldName: string; values: Set<string> } });
//   };

//   const handleNextClick = () => {
//     const filtersSelected = Object.entries(selectedItemsPerField).reduce(
//       (acc, [fieldId, selectedValues]) => {
//         const field = report?.fields.find((field) => field._id === fieldId);
//         if (field) {
//           acc[field.name] = Array.from(selectedValues);
//         }
//         return acc;
//       },
//       {} as { [fieldName: string]: string[] }
//     );

//     setSelectedFilters(filtersSelected);
//     setShowChartTable(true);
//   };

//   const clearAllFilters = () => {
//     const clearedState: SelectedItemsState = {};
//     Object.keys(selectedItemsPerField).forEach((fieldId) => {
//       clearedState[fieldId] = new Set();
//     });
//     setSelectedItemsPerField(clearedState);
//     setSelectedFilters({});
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin size="large" spinning={true}>
//           <div className="text-center">
//             <ReloadOutlined spin className="text-4xl mb-4" />
//             <p>Loading report...</p>
//           </div>
//         </Spin>
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="w-full p-8 text-center">
//         <div className="text-red-600 font-semibold mb-2">Error</div>
//         <div>{error}</div>
//       </div>
//     );
//   }

//   // Render chart table if filters are applied
//   if (showChartTable && report) {
//     return (
//       <ChartTableComponent report={report} selectedFilters={selectedFilters} />
//     );
//   }

//   // Main render with Layout
//   return (
//     <Layout className="min-h-screen">
//       {/* Sidebar Filters */}
//       <Sider
//         theme="light"
//         collapsible
//         collapsed={!isSidebarOpen}
//         onCollapse={(collapsed) => setIsSidebarOpen(!collapsed)}
//         width={350}
//         className="overflow-auto"
//       >
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Filters</h2>
//             <Button
//               type="text"
//               icon={<CloseOutlined />}
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           </div>

//           <Divider />

//           {Object.entries(prepareGroupedDataItems()).map(
//             ([fieldId, { fieldName, values }]) => (
//               <div key={fieldId} className="mb-6">
//                 <h3 className="text-md font-semibold mb-2 capitalize">
//                   {fieldName}
//                 </h3>

//                 <Input
//                   prefix={<SearchOutlined />}
//                   placeholder={`Search ${fieldName}`}
//                   value={searchTerms[fieldId] || ""}
//                   onChange={(e) =>
//                     setSearchTerms((prev) => ({
//                       ...prev,
//                       [fieldId]: e.target.value,
//                     }))
//                   }
//                   className="mb-2"
//                 />

//                 <div className="flex justify-between mb-2">
//                   <Button
//                     size="small"
//                     onClick={() => handleSelectAll(fieldId, [...values])}
//                   >
//                     Select All
//                   </Button>
//                   <Button
//                     size="small"
//                     onClick={() => handleDeselectAll(fieldId)}
//                   >
//                     Clear
//                   </Button>
//                 </div>

//                 <div
//                   style={{
//                     maxHeight: "200px",
//                     overflowY: "auto",
//                     border: "1px solid #d9d9d9",
//                     borderRadius: "4px",
//                     padding: "8px",
//                   }}
//                 >
//                   {[...values].map((value) => (
//                     <div key={value} className="flex items-center mb-1">
//                       <Checkbox
//                         checked={selectedItemsPerField[fieldId]?.has(value)}
//                         onChange={() => handleItemChange(fieldId, value)}
//                       >
//                         {value}
//                       </Checkbox>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           )}

//           <div className="mt-4">
//             <Button
//               type="primary"
//               block
//               onClick={handleNextClick}
//               disabled={Object.values(selectedItemsPerField).every(
//                 (set) => set.size === 0
//               )}
//             >
//               Apply Filters
//               <CheckOutlined />
//             </Button>
//           </div>
//         </div>
//       </Sider>

//       {/* Main Content Area */}
//       <Layout>
//         <Content className="p-4 bg-gray-100">
//           <StepsComponent currentStep={1} />

//           {!isSidebarOpen && (
//             <Button
//               type="default"
//               className="mb-4 flex items-center"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <FaFilter className="mr-2" />
//               Open Filters
//             </Button>
//           )}

//           {/* Filter Drawer for Mobile/Compact View */}
//           <Drawer
//             title="Applied Filters"
//             placement="right"
//             closable={true}
//             onClose={() => setIsFilterDrawerVisible(false)}
//             open={isFilterDrawerVisible}
//             width={350}
//           >
//             {Object.entries(selectedFilters).map(([fieldName, values]) => (
//               <div key={fieldName} className="mb-4">
//                 <h4 className="text-sm font-semibold capitalize mb-2">
//                   {fieldName}
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {values.map((value) => (
//                     <Tag key={value} color="processing">
//                       {value}
//                     </Tag>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {Object.keys(selectedFilters).length > 0 && (
//               <Button type="danger" block onClick={clearAllFilters}>
//                 Clear All Filters
//               </Button>
//             )}
//           </Drawer>

//           {/* Content placeholder or results */}
//           <div className="bg-white rounded-lg p-6 shadow-md">
//             <h1 className="text-2xl font-bold mb-4">
//               Reports with Filtered Fields
//             </h1>

//             {Object.keys(prepareGroupedDataItems()).length === 0 ? (
//               <p className="text-gray-500">
//                 No reports found with filtered fields.
//               </p>
//             ) : (
//               <p>Select filters from the sidebar to view and apply filters.</p>
//             )}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default FilteredReportPage;
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spin, Empty, Checkbox, Tooltip, Input, Collapse, Tag } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  SearchOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import ChartTableComponent from "@/app/result/ChartTableComponent";

const { Panel } = Collapse;

// Existing interfaces from the previous implementation
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

interface SelectedItemsState {
  [fieldId: string]: {
    type: "discrete";
    selectedValues: Set<string>;
  };
}

const FilteredReportPage: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { filterId } = params;

  // State Management
  const [report, setReport] = useState<Report | null>(null);
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

  // Fetch Report Data
  useEffect(() => {
    const fetchReport = async () => {
      if (!filterId || !session?.accessToken) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/${filterId}`,
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
        setReport(data);

        // Initialize filter states with enhanced logic
        const initialSelectedState: SelectedItemsState = {};
        const initialSearchTerms: { [fieldId: string]: string } = {};

        data.fields
          .filter((field: Field) => field.filtered)
          .forEach((field: Field) => {
            // Get unique values for the field
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
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filterId, session]);

  // Grouped Data Items with Enhanced Processing
  const groupedDataItems = useMemo(() => {
    if (!report) return {};

    return (
      report.fields
        .filter((field) => field.filtered)
        .reduce(
          (acc, field) => {
            const filteredItemsForField = report.data
              .filter((dataItem) => dataItem.field._id === field._id)
              .map((dataItem) => dataItem.value);

            // Always treat as discrete, but convert to proper type if numeric
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
                    ? numericValues.map(String) // Convert numeric to string
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
  }, [report]);

  // Handler Functions
  const handleDiscreteSelectAll = (fieldId: string, items: string[]) => {
    setSelectedItemsPerField((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        selectedValues: new Set(items),
      },
    }));
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

  const applyFilters = () => {
    const filtersSelected = Object.entries(selectedItemsPerField).reduce(
      (acc, [fieldId, selectedFilter]) => {
        const field = report?.fields.find((f) => f._id === fieldId);
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

    if (Object.keys(filtersSelected).length > 0) {
      setSelectedFilters(filtersSelected);
      setShowChartTable(true);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large">
          <div className="p-12">Loading report...</div>
        </Spin>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 font-semibold mb-2">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  // Render Chart Table if Filters are Selected
  // if (showChartTable && report) {
  //   return (
  //     <ChartTableComponent report={report} selectedFilters={selectedFilters} />
  //   );
  // }

  // return (
  //   <div className="w-full h-screen flex">
  //     {/* Collapsible Sidebar */}
  //     <div
  //       className={`
  //         ${isSidebarOpen ? "w-96" : "w-16"}
  //         bg-[##F4F7F8]
  //         transition-all
  //         duration-300
  //         ease-in-out
  //         overflow-hidden
  //       `}
  //     >
  //       {/* Sidebar Toggle */}
  //       <div className="flex bg-blue justify-between items-center p-4">
  //         <Tooltip
  //           title={isSidebarOpen ? "Collapse Filters" : "Expand Filters"}
  //         >
  //           <button
  //             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  //             className="text-white p-2 rounded-full hover:bg-white/20 transition"
  //           >
  //             {isSidebarOpen ? <LeftOutlined /> : <RightOutlined />}
  //           </button>
  //         </Tooltip>
  //       </div>

  //       {/* Filter Content */}
  //       {isSidebarOpen && (
  //         <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-72px)]">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700">
  //               Filters
  //             </label>
  //           </div>
  //           <Collapse accordion defaultActiveKey={[]}>
  //             {Object.entries(groupedDataItems).map(
  //               ([fieldId, { fieldName, type, values }]) => (
  //                 <Panel header={fieldName} key={fieldId}>
  //                   <div>
  //                     <div className="flex justify-between items-center mb-3">
  //                       {values.length > 0 && (
  //                         <Checkbox
  //                           indeterminate={
  //                             selectedItemsPerField[fieldId]?.selectedValues
  //                               .size > 0 &&
  //                             selectedItemsPerField[fieldId]?.selectedValues
  //                               .size !== values.length
  //                           }
  //                           checked={
  //                             selectedItemsPerField[fieldId]?.selectedValues
  //                               .size === values.length
  //                           }
  //                           onChange={() =>
  //                             handleDiscreteSelectAll(
  //                               fieldId,
  //                               selectedItemsPerField[fieldId]?.selectedValues
  //                                 .size === values.length
  //                                 ? []
  //                                 : values
  //                             )
  //                           }
  //                         >
  //                           Select All
  //                         </Checkbox>
  //                       )}
  //                     </div>

  //                     {/* Search Input */}
  //                     <div className="relative mb-3">
  //                       <Input
  //                         placeholder={`Search ${fieldName}`}
  //                         value={searchTerms[fieldId] || ""}
  //                         onChange={(e) =>
  //                           handleSearchChange(fieldId, e.target.value)
  //                         }
  //                         prefix={<SearchOutlined className="text-gray-500" />}
  //                       />
  //                     </div>

  //                     <div className="max-h-64 overflow-y-auto border rounded">
  //                       {values
  //                         .filter((value) =>
  //                           value
  //                             .toLowerCase()
  //                             .includes(searchTerms[fieldId] || "")
  //                         )
  //                         .map((value) => (
  //                           <Checkbox
  //                             key={value}
  //                             checked={selectedItemsPerField[
  //                               fieldId
  //                             ]?.selectedValues?.has(value)}
  //                             onChange={() =>
  //                               handleDiscreteItemChange(fieldId, value)
  //                             }
  //                             className="w-full p-2 hover:bg-gray-50"
  //                           >
  //                             {value}
  //                           </Checkbox>
  //                         ))}
  //                     </div>
  //                   </div>
  //                 </Panel>
  //               )
  //             )}
  //           </Collapse>

  //           {/* Apply Filters Button */}
  //           <button
  //             onClick={applyFilters}
  //             disabled={Object.values(selectedItemsPerField).every(
  //               (selections) => selections.selectedValues.size === 0
  //             )}
  //             className="
  //               w-full py-3 rounded mt-4
  //               bg-[#2B5BA8] text-white
  //               hover:bg-[#234a87]
  //               transition-colors
  //               disabled:opacity-50 disabled:cursor-not-allowed
  //             "
  //           >
  //             Apply Filters
  //           </button>
  //         </div>
  //       )}
  //     </div>

  //     {/* Main Content Placeholder */}
  //     <div className="flex-1 bg-gray-100 flex items-center justify-center">
  //       <Empty
  //         description="Select filters to view report"
  //         className="text-gray-500"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-full h-screen flex">
      {/* Collapsible Sidebar */}
      {/* <div
        className={`
        ${isSidebarOpen ? "w-80" : "w-20"} 
        bg-gray-50 shadow-md 
        transition-all 
        duration-300 
        ease-in-out 
        overflow-hidden
        border-r
      `}
      > */}
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
            {/* Filters Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Filters
              </h3>
            </div>
            {/* Filters Section */}

            {/* <Collapse
              accordion
              defaultActiveKey={[]}
              expandIcon={({ isActive }) => (
                <CaretDownOutlined rotate={isActive ? 180 : 0} />
              )}
              className="bg-white border border-gray-200 rounded-lg"
            >
              {Object.entries(groupedDataItems).map(
                ([fieldId, { fieldName, type, values }]) => (
                  <Panel
                    header={
                      <div className="text-gray-700 font-medium flex items-center">
                        <span>{fieldName}</span>
                        <Tag color="blue" className="ml-2 text-xs">
                          {type}
                        </Tag>
                      </div>
                    }
                    key={fieldId}
                    className="text-gray-700"
                  >
                    <div>
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

                      <div className="relative mb-3">
                        <Input
                          placeholder={`Search ${fieldName}`}
                          value={searchTerms[fieldId] || ""}
                          onChange={(e) =>
                            handleSearchChange(fieldId, e.target.value)
                          }
                          prefix={<SearchOutlined className="text-gray-400" />}
                          className="rounded-md"
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
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
                              className="w-full p-2 hover:bg-gray-100 flex items-center"
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
            */}

            <Collapse
              accordion
              defaultActiveKey={[]}
              expandIcon={({ isActive }) => (
                <CaretDownOutlined rotate={isActive ? 180 : 0} />
              )}
              className="bg-white border border-gray-200 rounded-lg"
            >
              {Object.entries(groupedDataItems).map(
                ([fieldId, { fieldName, type, values }]) => (
                  <Panel
                    header={
                      <div className="text-gray-700 font-medium flex items-center">
                        <span>{fieldName}</span>
                        <Tag color="blue" className="ml-2 text-xs">
                          {type}
                        </Tag>
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

                      {/* Search Input */}
                      <div className="relative mb-3">
                        <Input
                          placeholder={`Search ${fieldName}`}
                          value={searchTerms[fieldId] || ""}
                          onChange={(e) =>
                            handleSearchChange(fieldId, e.target.value)
                          }
                          prefix={<SearchOutlined className="text-gray-400" />}
                          className="rounded-md"
                        />
                      </div>

                      {/* Checkbox Grid */}
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

            {/* Apply Filters Button */}
            <button
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
            </button>
          </div>
        )}
      </div>

      {/* Main Content Placeholder */}
      {/* <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <Empty
          description="Select filters to view report"
          className="text-gray-500"
        />
      </div>
    </div> */}
      {/* Main Content */}
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        {error ? (
          <div className="w-full p-8 text-center">
            <div className="text-red-600 font-semibold mb-2">Error</div>
            <div>{error}</div>
          </div>
        ) : showChartTable && report ? (
          <ChartTableComponent
            report={report}
            selectedFilters={selectedFilters}
          />
        ) : (
          <div className="text-center text-gray-500">
            Select filters to view the data.
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredReportPage;
