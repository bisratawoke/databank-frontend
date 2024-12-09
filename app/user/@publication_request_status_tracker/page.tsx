import fetchPublicationRequets from "./actions/fetchPublicationRequets";
export default async function Page() {
  const { body: publicationRequests } = await fetchPublicationRequets();
  return <div></div>;
}
