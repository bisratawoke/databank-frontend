"use client";

import React from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import createPublicationRequest from "../actions/createPublicationRequest";

const { Option } = Select;

const ADMIN_UNITS = [
  { label: "National", value: "National" },
  { label: "Reginal", value: "Reginal" },
  { label: "Woreda", value: "Woreda" },
  { label: "Zoneal", value: "Zoneal" },
  { label: "Kebele", value: "Kebele" },
];

interface Category {
  _id: string;
  name: string;
}

interface Props {
  categories: Category[];
}

const PublicationRequestForm: React.FC<Props> = ({ categories }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      // Append form values
      Object.keys(values).forEach((key) => {
        if (key === "file" && values[key]) {
          formData.append(key, values[key].file.originFileObj);
        } else if (Array.isArray(values[key])) {
          values[key].forEach((item: string) =>
            formData.append(`${key}[]`, item)
          );
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await createPublicationRequest(formData);

      if (response.status === 201) {
        message.success("Publication request created successfully!");
        form.resetFields();
      } else {
        message.error(
          `Failed to create publication request: ${
            response.body || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      message.error(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Create a Publication Request
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            preferredDataFormat: "",
            purposeForResearch: "",
            dateImportance: "",
            adminUnits: "National",
          }}
          className="space-y-4"
        >
          <Form.Item
            label="Categories"
            name="category"
            rules={[
              {
                required: true,
                message: "Please select at least one category!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select categories"
              options={categories.map((category) => ({
                label: category.name,
                value: category._id,
              }))}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Preferred Data Format"
            name="preferredDataFormat"
            rules={[
              {
                required: true,
                message: "Please enter a preferred data format!",
              },
            ]}
          >
            <Input placeholder="e.g., CSV, JSON, Excel" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Purpose for Research"
            name="purposeForResearch"
            rules={[
              {
                required: true,
                message: "Please enter the purpose for research!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Explain the purpose for research"
              rows={4}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Data Importance"
            name="dateImportance"
            rules={[
              {
                required: true,
                message: "Please explain the importance of the data!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Explain the importance of the data"
              rows={4}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Administrative Unit"
            name="adminUnits"
            rules={[
              {
                required: true,
                message: "Please select an administrative unit!",
              },
            ]}
          >
            <Select className="w-full">
              {ADMIN_UNITS.map((unit) => (
                <Option key={unit.value} value={unit.value}>
                  {unit.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="File Upload"
            name="file"
            valuePropName="file"
            getValueFromEvent={(e: any) =>
              Array.isArray(e) ? e : e?.fileList[0]
            }
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
            >
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PublicationRequestForm;
