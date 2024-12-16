// "use client";

// import React, { useState } from "react";
// import { ConfigProvider, Spin, Layout } from "antd";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { FilterableFieldsPanel } from "./components/ReportSelection/FilterableFieldsPanel";

// import { useFilterState } from "./hooks/useFilterState";
// import FilterSidebar from "./components/FilterManagement/FilterSidebar";
// import DataPreview from "./components/DataPreview";
// import FilterModal from "./components/FilterManagement/FilterModal";

// const { Sider, Content } = Layout;

// // Create a query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000,
//       cacheTime: 10 * 60 * 1000,
//       refetchOnWindowFocus: false,
//       retry: 2,
//     },
//   },
// });

// const DashboardPage: React.FC = ({departments}) => {
//   const [selectedReport, setSelectedReport] = useState<string | null>(null);
//   const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
//     {}
//   );

//   const { filterConfig, filterState, updateFilter, isFilterComplete } =
//     useFilterState();

//   const handleReportSelection = (reportId: string) => {
//     setSelectedReport(reportId);
//   };

//   const handleFiltersChange = (filters: Record<string, any>) => {
//     setSelectedFilters(filters);
//   };

//   return (
//     <ConfigProvider>
//       <QueryClientProvider client={queryClient}>
//         <Layout style={{ height: "100vh" }}>
//           <Sider width={300} theme="light">
//             <FilterSidebar
//               filterConfig={filterConfig}
//               onFilterChange={updateFilter}
//             />
//           </Sider>

//           <Content style={{ padding: "24px", overflowY: "auto" }}>
//             {selectedReport ? (
//               <FilterableFieldsPanel
//                 reportId={selectedReport}
//                 onFiltersChange={handleFiltersChange}
//               />
//             ) : (
//               <div>Select a Report</div>
//             )}

//             <DataPreview reportId={selectedReport} filters={selectedFilters} />
//           </Content>

//           <FilterModal
//             filterState={filterState}
//             isComplete={isFilterComplete()}
//             onApply={() => {
//               /* Implement filter application logic */
//             }}
//           />
//         </Layout>
//       </QueryClientProvider>
//     </ConfigProvider>
//   );
// };

// export default DashboardPage;

"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ConfigProvider, Layout } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterableFieldsPanel } from "./components/ReportSelection/FilterableFieldsPanel";
import { useFilterState } from "./hooks/useFilterState";
import FilterSidebar from "./components/FilterManagement/FilterSidebar";
import DataPreview from "./components/DataPreview";
import FilterModal from "./components/FilterManagement/FilterModal";
import { Department } from "./types/types"; // Assuming you have a types file
import { useRouter } from "next/navigation";

const { Sider, Content } = Layout;

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

interface DashboardPageProps {
  departments: Department[];
}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  const router = useRouter();
  const [parsedDepartments, setParsedDepartments] = useState(null);

  console.log("departments recieved", router);
  // useEffect(() => {
  //   // Check if router is ready to ensure query params are available
  //   if (router.isReady) {
  //     const { departments } = router.query;

  //     if (departments) {
  //       try {
  //         const parsed = JSON.parse(departments as string);
  //         setParsedDepartments(parsed);
  //       } catch (error) {
  //         console.error("Error parsing departments", error);
  //       }
  //     }
  //   }
  // }, [router.isReady, router.query]);

  // console.log("departments recieved", parsedDepartments);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );

  const { filterConfig, filterState, updateFilter, isFilterComplete } =
    useFilterState();

  // Extract all reports, categories, and subcategories from departments
  const extractReportDetails = useMemo(() => {
    const reports: {
      id: string;
      name: string;
      departmentName: string;
      categoryName: string;
      subcategoryName: string;
    }[] = [];

    parsedDepartments.forEach((department) => {
      department.category.forEach((category) => {
        category.subcategory.forEach((subcategory) => {
          if (subcategory.report && subcategory.report.length > 0) {
            subcategory.report.forEach((report) => {
              reports.push({
                id: report._id,
                name: report.name,
                departmentName: department.name,
                categoryName: category.name,
                subcategoryName: subcategory.name,
              });
            });
          }
        });
      });
    });

    return reports;
  }, [parsedDepartments]);

  // Prepare filter configuration based on extracted details
  const preparedFilterConfig = useMemo(() => {
    return {
      departments: parsedDepartments.map((dept) => ({
        id: dept._id,
        name: dept.name,
      })),
      categories: parsedDepartments.flatMap((dept) =>
        dept.category.map((category) => ({
          id: category._id,
          name: category.name,
          departmentId: dept._id,
        }))
      ),
      subcategories: parsedDepartments.flatMap((dept) =>
        dept.category.flatMap((category) =>
          category.subcategory.map((subcategory) => ({
            id: subcategory._id,
            name: subcategory.name,
            categoryId: category._id,
            departmentId: dept._id,
          }))
        )
      ),
      reports: extractReportDetails,
    };
  }, [parsedDepartments, extractReportDetails]);

  const handleReportSelection = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const handleFiltersChange = (filters: Record<string, any>) => {
    setSelectedFilters(filters);
  };

  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <Layout style={{ height: "100vh" }}>
          <Sider width={300} theme="light">
            <FilterSidebar
              filterConfig={preparedFilterConfig}
              onFilterChange={updateFilter}
            />
          </Sider>

          <Content style={{ padding: "24px", overflowY: "auto" }}>
            {selectedReport ? (
              <FilterableFieldsPanel
                reportId={selectedReport}
                onFiltersChange={handleFiltersChange}
              />
            ) : (
              <div>Select a Report</div>
            )}

            <DataPreview reportId={selectedReport} filters={selectedFilters} />
          </Content>

          <FilterModal
            filterState={filterState}
            isComplete={isFilterComplete()}
            onApply={() => {
              /* Implement filter application logic */
            }}
          />
        </Layout>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default DashboardPage;
