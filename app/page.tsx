import DepartmentsPage from "./departments/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchDepartments = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/departments/all`, {
    cache: "no-store", // To avoid caching during development
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default async function Home() {
  const departmentsData = await fetchDepartments();
  const departments = departmentsData.departments;

  return (
    <>
      {/* <InfoSection /> */}
      {/* <DepartmentsLists departments={departments} /> */}
      {/* <HomePage /> */}
      <DepartmentsPage departments={departments} />
    </>
  );
}
