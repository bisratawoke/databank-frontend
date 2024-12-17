"use client";
import { Table, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DepartmentListJumbotron from "./departmentListJumbotron";

export default function PublicationList({
  publications,
}: {
  publications: Array<Record<string, any>>;
}) {
  const [hoveredRowKey, setHoveredRowKey] = useState<string | null>(null);
  const router = useRouter();

  const columns = [
    {
      title: <span className="font-bold text-[20px]">Title</span>,
      dataIndex: "fileName",
      key: "fileName",
      render: (value: string) => (
        <span className="text-[16px]">
          {`${value.split("/")[value.split("/").length - 1]}`.split(".")[0]}
        </span>
      ),
    },
    {
      title: <span className="font-bold text-[20px]">Type</span>,
      dataIndex: "fileName",
      key: "fileName",
      render: (value: string) => (
        <Tag
          color={
            `${value.split("/")[value.split("/").length - 1]}`.split(".")[1] ===
            "pdf"
              ? "pink"
              : "blue"
          }
        >
          {`${value.split("/")[value.split("/").length - 1]}`.split(".")[1]}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <DepartmentListJumbotron />
      <div className="grid grid-cols-12">
        <div className="col-start-3 col-end-10">
          <Table
            dataSource={publications}
            columns={columns}
            rowKey="_id"
            pagination={false}
            onRow={(record) => ({
              onMouseEnter: () => setHoveredRowKey(record._id),
              onMouseLeave: () => setHoveredRowKey(null),
              onClick: () => {
                router.push(`/publication/view/${record._id}`);
              },
            })}
            rowClassName={(record) =>
              hoveredRowKey === record._id ? "hovered-row" : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
