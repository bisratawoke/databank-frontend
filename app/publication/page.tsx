import fetchDepatments from "./actions/fetchDepartments";
import DepartmentsLists from "./components/depatmentList";

export default async function Page() {
  const { body: departments } = await fetchDepatments();

  return <DepartmentsLists departments={departments} />;
}
