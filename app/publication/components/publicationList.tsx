"use client";
import { Table } from "antd";
import { useRouter } from "next/navigation";
export default function PublicationList({
  publications,
}: {
  publications: Array<Record<string, any>>;
}) {
  const router = useRouter();
  const columns = [
    {
      title: "Title",
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
  );
}
