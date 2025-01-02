"use client";
import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Form, Input, Col, Row, Grid } from "antd";
import { EditOutlined } from "@ant-design/icons";
import EditUserForm from "./EditUserForm";

const UserProfileCard: React.FC<{
  profileInfo: Record<string, any>;
}> = ({ profileInfo: data }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="grid grid-cols-12 h-[60vh]">
      {/* <div className="col-start-1 col-end-3 bg-red-500"></div> */}
      <div className="col-start-1 col-end-13">
        <EditUserForm data={data} />
      </div>
    </div>
  );
};

export default UserProfileCard;
