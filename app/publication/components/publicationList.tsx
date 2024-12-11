"use client";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import DepartmentListJumbotron from "./departmentListJumbotron";
export default function PublicationList({
  publications,
}: {
  publications: Array<Record<string, any>>;
}) {
  const router = useRouter();
  const columns = [
    {
      title: <span className="font-bold text-[32px]">Title</span>,
      dataIndex: "fileName",
      key: "fileName",
      render: (value: string) => (
        <span className="text-[16px]">
          {value.split("/")[value.split("/").length - 1]}
        </span>
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
            onRow={(record) => {
              return {
                onClick: () => {
                  router.push(`/publication/view/${record._id}`);
                },
              };
            }}
          />
        </div>
      </div>
    </div>
  );
}
