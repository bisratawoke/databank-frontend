"use client"; // Mark this component as a client component
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // For fetching dynamic route parameters
import { Spin } from "antd";

const FilteredReportPage = () => {
  const router = useRouter();
  const { filterId } = router.query; // Extract filterId from the URL

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!filterId) return; // Wait until filterId is available

    const fetchReport = async () => {
      try {
        const response = await fetch(`${API_URL}/reports/${filterId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filterId]);

  if (loading) {
    return <Spin spinning={loading}>Loading report...</Spin>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!report) {
    return <div>No report found for this ID.</div>;
  }

  return (
    <div>
      <h1>{report.name}</h1>
      <p>{report.description}</p>
      <p>Start Date: {new Date(report.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(report.end_date).toLocaleDateString()}</p>
    </div>
  );
};

export default FilteredReportPage;
