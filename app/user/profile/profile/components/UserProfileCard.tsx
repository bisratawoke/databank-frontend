"use client";
import React from "react";
import { Form } from "antd";
import EditUserForm from "./EditUserForm";

const UserProfileCard: React.FC<{
  profileInfo: Record<string, any>;
}> = ({ profileInfo: data }) => {
  const [form] = Form.useForm();

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
