import NewRequestButton from "../components/ui/buttons/NewRequestButton";
import PublicationRequestsTable from "../components/ui/tables/DataRequestTable";
import fetchPublicationRequets from "./actions/fetchPublicationRequest";
import AddNewRequest from "./components/addNewRequest";
export default async function Page() {
  const { body: publicationRequests } = await fetchPublicationRequets();
  console.log("============= in fetch publciation request =================");
  console.log(publicationRequests);
  return (
    <div className="grid grid-cols-12">
      <div className="col-start-3 col-end-11">
        <AddNewRequest />
        <PublicationRequestsTable data={publicationRequests} />;
      </div>
    </div>
  );
}
