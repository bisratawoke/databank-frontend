// "use client";
// import React, { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
// import type { Department } from "./types";

// interface DepartmentsListsProps {
//   departments: Department[];
// }

// const DepartmentsLists: React.FC<DepartmentsListsProps> = ({ departments }) => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   console.log("departments: ", departments);

//   useEffect(() => {
//     if (session === null) {
//       router.push("/auth/signin");
//     }
//   }, [session, router]);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
//         Departments and Categories
//       </h1>

//       <div className="space-y-4">
//         {departments.map((department) => (
//           <div
//             key={department._id}
//             className="border border-gray-200 rounded-lg shadow-sm"
//           >
//             <details className="group">
//               <summary
//                 className="
//                   flex items-center justify-between
//                   p-4 cursor-pointer
//                   bg-gray-50 hover:bg-gray-100
//                   transition-colors duration-300
//                   rounded-t-lg
//                   group-open:rounded-b-none
//                 "
//               >
//                 <span className="text-lg font-semibold text-gray-800">
//                   {department.name}
//                 </span>
//                 <MdKeyboardArrowDown
//                   className="
//                   w-5 h-5 text-gray-600
//                   group-open:rotate-180
//                   transition-transform duration-300
//                 "
//                 />
//               </summary>

//               <div className="p-4 bg-white">
//                 {department.category.map((cat) => (
//                   <div key={cat._id} className="mb-4 last:mb-0">
//                     <details className="group">
//                       <summary
//                         className="
//                           flex items-center justify-between
//                           p-3 cursor-pointer
//                           bg-gray-100 hover:bg-gray-200
//                           transition-colors duration-300
//                           rounded-lg
//                           group-open:rounded-b-none
//                         "
//                       >
//                         <span className="text-md font-medium text-gray-700">
//                           {cat.name}
//                         </span>
//                         <MdKeyboardArrowRight
//                           className="
//                             w-4 h-4 text-gray-600
//                             group-open:rotate-90
//                             transition-transform duration-300
//                           "
//                         />
//                       </summary>

//                       <div className="p-3 bg-gray-50">
//                         {cat.subcategory.map((subCat) => (
//                           <Link
//                             key={subCat._id}
//                             href={`/departments/reports/${department._id}/${subCat._id}`}
//                             className="
//                               block p-2
//                               text-blue-600 hover:text-blue-800
//                               hover:bg-blue-50
//                               rounded
//                               transition-colors duration-200
//                             "
//                           >
//                             {subCat.name}
//                           </Link>
//                         ))}
//                       </div>
//                     </details>
//                   </div>
//                 ))}
//               </div>
//             </details>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DepartmentsLists;

// ! Better imporeved with search bar
// "use client";
// import React, { useState, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   MdKeyboardArrowDown,
//   MdKeyboardArrowRight,
//   MdSearch,
//   MdClear,
// } from "react-icons/md";
// import type { Department } from "./types";

// interface DepartmentsListsProps {
//   departments: Department[];
// }

// const DepartmentsLists: React.FC<DepartmentsListsProps> = ({ departments }) => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

//   // Filter logic
//   const filteredDepartments = useMemo(() => {
//     if (!searchTerm) return departments;

//     const lowercaseSearch = searchTerm.toLowerCase();

//     return departments
//       .filter((department) => {
//         // Check if department name matches
//         const departmentMatch = department.name
//           .toLowerCase()
//           .includes(lowercaseSearch);

//         // Check if any category matches
//         const categoryMatch = department.category.some(
//           (cat) =>
//             cat.name.toLowerCase().includes(lowercaseSearch) ||
//             cat.subcategory.some((subCat) =>
//               subCat.name.toLowerCase().includes(lowercaseSearch)
//             )
//         );

//         return departmentMatch || categoryMatch;
//       })
//       .map((department) => ({
//         ...department,
//         category: department.category.filter(
//           (cat) =>
//             cat.name.toLowerCase().includes(lowercaseSearch) ||
//             cat.subcategory.some((subCat) =>
//               subCat.name.toLowerCase().includes(lowercaseSearch)
//             )
//         ),
//       }));
//   }, [departments, searchTerm]);

//   // Expand all matching departments when filtering
//   useMemo(() => {
//     const matchedDepartmentIds = filteredDepartments.map((dept) => dept._id);
//     setExpandedDepartments(matchedDepartmentIds);
//   }, [filteredDepartments]);

//   // Toggle department expansion
//   const toggleDepartment = (departmentId: string) => {
//     setExpandedDepartments((prev) =>
//       prev.includes(departmentId)
//         ? prev.filter((id) => id !== departmentId)
//         : [...prev, departmentId]
//     );
//   };

//   // Toggle category expansion
//   const toggleCategory = (categoryId: string) => {
//     setExpandedCategories((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setExpandedDepartments([]);
//     setExpandedCategories([]);
//   };

//   // Render nothing if no session
//   if (session === null) {
//     return null;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
//         Departments and Categories
//       </h1>

//       {/* Search Input */}
//       <div className="relative mb-6">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <MdSearch className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="Search departments, categories, and subcategories..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="
//             w-full pl-10 pr-10 py-2
//             border border-gray-300 rounded-lg
//             focus:outline-none focus:ring-2 focus:ring-blue-500
//             text-gray-900 placeholder-gray-500
//           "
//         />
//         {searchTerm && (
//           <button
//             onClick={clearSearch}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//           >
//             <MdClear className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//           </button>
//         )}
//       </div>

//       {/* Departments List */}
//       <div className="space-y-4">
//         {filteredDepartments.length === 0 ? (
//           <div className="text-center text-gray-500 py-4">
//             No departments found matching your search.
//           </div>
//         ) : (
//           filteredDepartments.map((department) => (
//             <div
//               key={department._id}
//               className="border border-gray-200 rounded-lg shadow-sm"
//             >
//               {/* Department Header */}
//               <div
//                 onClick={() => toggleDepartment(department._id)}
//                 className="
//                   flex items-center justify-between
//                   p-4 cursor-pointer
//                   bg-gray-50 hover:bg-gray-100
//                   transition-colors duration-300
//                   rounded-t-lg
//                 "
//               >
//                 <span className="text-lg font-semibold text-gray-800">
//                   {department.name}
//                 </span>
//                 <MdKeyboardArrowDown
//                   className={`
//                     w-5 h-5 text-gray-600
//                     transition-transform duration-300
//                     ${
//                       expandedDepartments.includes(department._id)
//                         ? "rotate-180"
//                         : ""
//                     }
//                   `}
//                 />
//               </div>

//               {/* Department Categories */}
//               {expandedDepartments.includes(department._id) && (
//                 <div className="p-4 bg-white">
//                   {department.category.map((cat) => (
//                     <div key={cat._id} className="mb-4 last:mb-0">
//                       <div
//                         onClick={() => toggleCategory(cat._id)}
//                         className="
//                           flex items-center justify-between
//                           p-3 cursor-pointer
//                           bg-gray-100 hover:bg-gray-200
//                           transition-colors duration-300
//                           rounded-lg
//                         "
//                       >
//                         <span className="text-md font-medium text-gray-700">
//                           {cat.name}
//                         </span>
//                         <MdKeyboardArrowRight
//                           className={`
//                             w-4 h-4 text-gray-600
//                             transition-transform duration-300
//                             ${
//                               expandedCategories.includes(cat._id)
//                                 ? "rotate-90"
//                                 : ""
//                             }
//                           `}
//                         />
//                       </div>

//                       {/* Subcategories */}
//                       {expandedCategories.includes(cat._id) && (
//                         <div className="p-3 bg-gray-50">
//                           {cat.subcategory.map((subCat) => (
//                             <Link
//                               key={subCat._id}
//                               href={`/departments/reports/${department._id}/${subCat._id}`}
//                               className="
//                                 block p-2
//                                 text-blue-600 hover:text-blue-800
//                                 hover:bg-blue-50
//                                 rounded
//                                 transition-colors duration-200
//                               "
//                             >
//                               {subCat.name}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default DepartmentsLists;

// "use client";
// import React, { useState, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { MdClear } from "react-icons/md";
// import type { Department } from "./types";

// interface DepartmentsListsProps {
//   departments: Department[];
// }

// const DepartmentsLists: React.FC<DepartmentsListsProps> = ({ departments }) => {
//   const { data: session } = useSession();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<{
//     departments: string[];
//     categories: string[];
//     subcategories: string[];
//   }>({
//     departments: [],
//     categories: [],
//     subcategories: [],
//   });

//   // Filter logic
//   const filteredDepartments = useMemo(() => {
//     const lowercaseSearch = searchTerm.toLowerCase();
//     return departments
//       .filter((department) => {
//         const matchesSearch =
//           department.name.toLowerCase().includes(lowercaseSearch) ||
//           department.category.some(
//             (cat) =>
//               cat.name.toLowerCase().includes(lowercaseSearch) ||
//               cat.subcategory.some((subCat) =>
//                 subCat.name.toLowerCase().includes(lowercaseSearch)
//               )
//           );

//         const matchesFilter =
//           (!selectedFilters.departments.length ||
//             selectedFilters.departments.includes(department._id)) &&
//           (!selectedFilters.categories.length ||
//             department.category.some((cat) =>
//               selectedFilters.categories.includes(cat._id)
//             )) &&
//           (!selectedFilters.subcategories.length ||
//             department.category.some((cat) =>
//               cat.subcategory.some((subCat) =>
//                 selectedFilters.subcategories.includes(subCat._id)
//               )
//             ));

//         return matchesSearch && matchesFilter;
//       })
//       .map((department) => ({
//         ...department,
//         category: department.category.filter(
//           (cat) =>
//             (!selectedFilters.categories.length ||
//               selectedFilters.categories.includes(cat._id)) &&
//             (!selectedFilters.subcategories.length ||
//               cat.subcategory.some((subCat) =>
//                 selectedFilters.subcategories.includes(subCat._id)
//               ))
//         ),
//       }));
//   }, [departments, searchTerm, selectedFilters]);

//   // Expand all matching departments when filtering
//   useMemo(() => {
//     const matchedDepartmentIds = filteredDepartments.map((dept) => dept._id);
//     setExpandedDepartments(matchedDepartmentIds);
//   }, [filteredDepartments]);

//   // Toggle department expansion
//   const toggleDepartment = (departmentId: string) => {
//     setExpandedDepartments((prev) =>
//       prev.includes(departmentId)
//         ? prev.filter((id) => id !== departmentId)
//         : [...prev, departmentId]
//     );
//   };

//   // Toggle category expansion
//   const toggleCategory = (categoryId: string) => {
//     setExpandedCategories((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   // Update filters
//   const handleFilterChange = (type: string, id: string) => {
//     setSelectedFilters((prev) => {
//       const updated = { ...prev };
//       updated[type] = prev[type].includes(id)
//         ? prev[type].filter((item) => item !== id)
//         : [...prev[type], id];
//       return updated;
//     });
//   };

//   // Render nothing if no session
//   if (session === null) {
//     return null;
//   }

//   return (
//     <div className="flex">
//       {/* Sidebar Filters */}
//       <div className="w-1/4 p-4 border-r border-gray-300">
//         <h2 className="text-lg font-semibold mb-4">Filters</h2>

//         {/* Department Filter */}
//         <div>
//           <h3 className="font-medium text-gray-700">Departments</h3>
//           {departments.map((department) => (
//             <label key={department._id} className="block text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedFilters.departments.includes(department._id)}
//                 onChange={() =>
//                   handleFilterChange("departments", department._id)
//                 }
//                 className="mr-2"
//               />
//               {department.name}
//             </label>
//           ))}
//         </div>

//         {/* Category Filter */}
//         <div className="mt-4">
//           <h3 className="font-medium text-gray-700">Categories</h3>
//           {departments
//             .flatMap((dept) => dept.category)
//             .map((cat) => (
//               <label key={cat._id} className="block text-sm">
//                 <input
//                   type="checkbox"
//                   checked={selectedFilters.categories.includes(cat._id)}
//                   onChange={() => handleFilterChange("categories", cat._id)}
//                   className="mr-2"
//                 />
//                 {cat.name}
//               </label>
//             ))}
//         </div>

//         {/* Subcategory Filter */}
//         <div className="mt-4">
//           <h3 className="font-medium text-gray-700">Subcategories</h3>
//           {departments
//             .flatMap((dept) => dept.category)
//             .flatMap((cat) => cat.subcategory)
//             .map((subCat) => (
//               <label key={subCat._id} className="block text-sm">
//                 <input
//                   type="checkbox"
//                   checked={selectedFilters.subcategories.includes(subCat._id)}
//                   onChange={() =>
//                     handleFilterChange("subcategories", subCat._id)
//                   }
//                   className="mr-2"
//                 />
//                 {subCat.name}
//               </label>
//             ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-3/4 p-4">
//         <h1 className="text-2xl font-bold mb-6">Departments and Categories</h1>

//         {/* Search Input */}
//         <div className="relative mb-6">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute right-2 top-2"
//             >
//               <MdClear />
//             </button>
//           )}
//         </div>

//         {/* Departments List */}
//         {filteredDepartments.map((department) => (
//           <div key={department._id} className="mb-4">
//             <div
//               onClick={() => toggleDepartment(department._id)}
//               className="cursor-pointer font-semibold text-lg"
//             >
//               {department.name}
//             </div>
//             {expandedDepartments.includes(department._id) && (
//               <div className="ml-4">
//                 {department.category.map((cat) => (
//                   <div key={cat._id}>
//                     <div
//                       onClick={() => toggleCategory(cat._id)}
//                       className="cursor-pointer font-medium"
//                     >
//                       {cat.name}
//                     </div>
//                     {expandedCategories.includes(cat._id) && (
//                       <div className="ml-4">
//                         {cat.subcategory.map((subCat) => (
//                           <Link
//                             key={subCat._id}
//                             href={`/departments/reports/${department._id}/${subCat._id}`}
//                             className="block text-blue-600"
//                           >
//                             {subCat.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DepartmentsLists;
