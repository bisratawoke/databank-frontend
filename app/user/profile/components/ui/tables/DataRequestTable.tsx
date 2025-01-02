"use client";

import React from "react";
import { Table, Tag } from "antd";
import { PublicationRequest } from "../../../types/IPublicationRequest";
import DownloadFileButton from "../buttons/DownloadFileButton";

const PublicationRequestsTable = ({ data }: { data: PublicationRequest[] }) => {
  const columns = [
    // {
    //   title: "Payment Required",
    //   dataIndex: "paymentRequired",
    //   key: "paymentRequired",
    //   render: (text: string) => (text ? "Yes" : "No"),
    // },
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   key: "category",
    //   render: (categories: string[]) =>
    //     categories.map((category) => <Tag key={category}>{category}</Tag>),
    // },
    // {
    //   title: "Preferred Data Format",
    //   dataIndex: "preferredDataFormat",
    //   key: "preferredDataFormat",
    // },
    // {
    //   title: "Purpose for Research",
    //   dataIndex: "purposeForResearch",
    //   key: "purposeForResearch",
    // },
    // {
    //   title: "Date Importance",
    //   dataIndex: "dateImportance",
    //   key: "dateImportance",
    // },

    {
      title: "Admin Units",
      dataIndex: "adminUnits",
      key: "adminUnits",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "Deputy Approved" ? "green" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <>
          {record.status == "Final Approved" && (
            <DownloadFileButton fileName={record.fileName} />
          )}
        </>
      ),
    },
    // {
    //   title: "Attachments",
    //   dataIndex: "attachments",
    //   key: "attachments",
    //   render: (attachments: string[]) =>
    //     attachments.map((attachment, index) => (
    //       <a
    //         key={index}
    //         href={`http://${attachment}`}
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         View File {index + 1}
    //       </a>
    //     )),
    // },
  ];

  return (
    <Table
      dataSource={data.map((item) => ({ ...item, key: item._id }))}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default PublicationRequestsTable;
