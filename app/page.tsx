import DepartmentsPage from "./departments/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchDepartments = async () => {
  const res = await fetch(`${API_URL}/departments`, {
    cache: "no-store", // To avoid caching during development
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default async function Home() {
  const departments = await fetchDepartments();

  return (
    <>
      {/* <InfoSection /> */}
      {/* <DepartmentsLists departments={departments} /> */}
      {/* <HomePage /> */}
      <DepartmentsPage departments={departments} />
    </>
  );
}
