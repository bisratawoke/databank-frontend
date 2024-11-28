// "use client";

// import React, { useEffect } from "react";
// import { Collapse, Typography } from "antd";
// import { DownOutlined } from "@ant-design/icons";
// import Link from "next/link";
// import type { Department } from "./types";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// const { Panel } = Collapse;
// const { Title } = Typography;

// interface DepartmentsListsProps {
//   departments: Department[];
// }

// interface CustomExpandIconProps {
//   isActive: boolean;
// }

// const DepartmentsLists = ({ departments }: DepartmentsListsProps) => {
//   const router = useRouter();
//   const { data: status } = useSession();
//   useEffect(() => {
//     console.log("status: ", status);

//     if (status === null) {
//       router.push("/auth/signin");
//     }
//   }, [status, router]);

//   const customExpandIcon = ({ isActive }: CustomExpandIconProps) => (
//     <DownOutlined
//       style={{
//         fontWeight: "bold",
//         color: "#224986", // Custom color for the icon
//         fontSize: "12px", // Smaller icon size
//         transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
//         transition: "transform 0.3s",
//       }}
//     />
//   );

//   return (
//     <div className="p-4 md:p-6 xl:px-[17%]">
//       <Title level={3} className="mb-6 font-bold text-center">
//         Departments and Categories
//       </Title>
//       <Collapse
//         expandIconPosition="end"
//         expandIcon={customExpandIcon}
//         bordered={false}
//         style={{
//           background: "none",
//         }}
//       >
//         {departments.map((department) => (
//           <Panel
//             header={department.name}
//             key={department._id}
//             style={{
//               borderBottom: "1px solid #ddd",
//               fontWeight: "bold",
//               padding: "10px 0",
//             }}
//             className="custom-panel"
//           >
//             {department.category.map((cat) => (
//               <Collapse key={cat._id} ghost expandIcon={customExpandIcon}>
//                 <Panel
//                   header={cat.name}
//                   key={cat._id}
//                   style={{
//                     borderBottom: "1px solid #ddd",
//                     fontWeight: "bold",
//                     padding: "10px 0",
//                   }}
//                 >
//                   {cat.subcategory.map((subCat) => (
//                     <div
//                       key={subCat._id}
//                       className="ml-4 p-2 border-b border-gray-200"
//                     >
//                       <h4 className="font-bold">
//                         <Link
//                           href={`departments/reports/${department._id}/${subCat._id}`}
//                           className="text-blue-500 hover:underline"
//                         >
//                           {subCat.name}
//                         </Link>
//                       </h4>
//                     </div>
//                   ))}
//                 </Panel>
//               </Collapse>
//             ))}
//           </Panel>
//         ))}
//       </Collapse>
//     </div>
//   );
// };

// export default DepartmentsLists;
"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import type { Department } from "./types";

interface DepartmentsListsProps {
  departments: Department[];
}

const DepartmentsLists: React.FC<DepartmentsListsProps> = ({ departments }) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session === null) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Departments and Categories
      </h1>

      <div className="space-y-4">
        {departments.map((department) => (
          <div
            key={department._id}
            className="border border-gray-200 rounded-lg shadow-sm"
          >
            <details className="group">
              <summary
                className="
                  flex items-center justify-between 
                  p-4 cursor-pointer 
                  bg-gray-50 hover:bg-gray-100 
                  transition-colors duration-300
                  rounded-t-lg
                  group-open:rounded-b-none
                "
              >
                <span className="text-lg font-semibold text-gray-800">
                  {department.name}
                </span>
                <MdKeyboardArrowDown
                  className="
                  w-5 h-5 text-gray-600 
                  group-open:rotate-180 
                  transition-transform duration-300
                "
                />
              </summary>

              <div className="p-4 bg-white">
                {department.category.map((cat) => (
                  <div key={cat._id} className="mb-4 last:mb-0">
                    <details className="group">
                      <summary
                        className="
                          flex items-center justify-between 
                          p-3 cursor-pointer 
                          bg-gray-100 hover:bg-gray-200 
                          transition-colors duration-300
                          rounded-lg
                          group-open:rounded-b-none
                        "
                      >
                        <span className="text-md font-medium text-gray-700">
                          {cat.name}
                        </span>
                        <MdKeyboardArrowRight
                          className="
                            w-4 h-4 text-gray-600 
                            group-open:rotate-90 
                            transition-transform duration-300
                          "
                        />
                      </summary>

                      <div className="p-3 bg-gray-50">
                        {cat.subcategory.map((subCat) => (
                          <Link
                            key={subCat._id}
                            href={`/departments/reports/${department._id}/${subCat._id}`}
                            className="
                              block p-2 
                              text-blue-600 hover:text-blue-800 
                              hover:bg-blue-50 
                              rounded 
                              transition-colors duration-200
                            "
                          >
                            {subCat.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsLists;
