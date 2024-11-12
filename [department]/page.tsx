import Collapse from "antd/lib/collapse"; // Direct import from Ant Design
import Title from "antd/lib/typography/Title"; // Import Title directly
import Paragraph from "antd/lib/typography/Paragraph"; // Import Paragraph directly

const { Panel } = Collapse;

interface Department {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
    subcategory: string[];
    __v: number;
  }[];
}

// DepartmentPage Component
const DepartmentPage = async ({
  searchParams,
}: {
  searchParams: { id: string; name: string };
}) => {
  const departmentId = searchParams.id; // Get the department ID from the query parameters
  const departmentName = searchParams.name; // Get the department name from the query parameters

  if (!departmentId) {
    return <div>Department ID not found.</div>;
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch department data from the API
  const res = await fetch(`${API_URL}/departments/${departmentId}`);

  // Check if the response is ok
  if (!res.ok) {
    return <div>Error fetching department data.</div>;
  }

  const departmentData: Department = await res.json();

  // Check if department data is not found
  if (!departmentData) {
    return <div>Department not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 xl:px-[17%]">
      <Title level={2}>Department Details</Title>
      <Paragraph>
        <strong>Name:</strong> {departmentName || departmentData.name}
      </Paragraph>
      <Paragraph>
        <strong>ID:</strong> {departmentId}
      </Paragraph>
      <Collapse>
        {departmentData.category.map((cat) => (
          <Panel header={cat.name} key={cat._id}>
            <Paragraph>Subcategories:</Paragraph>
            <ul>
              {cat.subcategory.map((subId) => (
                <li key={subId}>{subId}</li> // Display the subcategory ID or name if available
              ))}
            </ul>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default DepartmentPage;
