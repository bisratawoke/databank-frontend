"use client";

import React from "react";
import { Collapse, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import DepartmentListJumbotron from "./departmentListJumbotron";
// import type { Department } from "./types";

const { Panel } = Collapse;
const { Title } = Typography;

interface DepartmentsListsProps {
  departments: any[];
}

interface CustomExpandIconProps {
  isActive: boolean;
}

const DepartmentsLists = ({ departments }: DepartmentsListsProps) => {
  const customExpandIcon = ({ isActive }: CustomExpandIconProps) => (
    <DownOutlined
      style={{
        fontWeight: "bold",
        color: "#224986",
        fontSize: "12px",
        transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s",
      }}
    />
  );

  return (
    <div>
      <DepartmentListJumbotron />
      <div className="p-4 md:p-6 xl:px-[17%]">
        <Title level={3} className="mb-6 font-bold text-left">
          Choose Topic And Table
        </Title>
        <Collapse
          expandIconPosition="end"
          expandIcon={customExpandIcon}
          bordered={false}
          style={{
            background: "none",
          }}
        >
          {departments.map((department) => (
            <Panel
              header={department.name}
              key={department._id}
              style={{
                borderBottom: "1px solid #ddd",
                fontWeight: "bold",
                padding: "10px 0",
              }}
              className="custom-panel"
            >
              {department.category.map((cat) => (
                <Collapse key={cat._id} ghost expandIcon={customExpandIcon}>
                  <Link
                    href={`/publication/${department._id}/${cat._id}`}
                    className="pl-[10px] font-bold hover:cursor-pointer"
                  >
                    {cat.name}
                  </Link>
                  {/* <Panel
                  header={cat.name}
                  key={cat._id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    fontWeight: "bold",
                    padding: "10px 0",
                  }}
                >
                  {cat.subcategory.map((subCat) => (
                    <div
                      key={subCat._id}
                      className="ml-4 p-2 border-b border-gray-200"
                    >
                      <h4 className="font-bold">
                        <Link
                          href={`departments/reports/${department._id}/${subCat._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {subCat.name}
                        </Link>
                      </h4>
                    </div>
                  ))}
                </Panel> */}
                </Collapse>
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default DepartmentsLists;
