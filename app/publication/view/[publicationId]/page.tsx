import FetchPublicationById from "../../actions/fetchPublicationById";
import SinglePublicationView from "../../components/singlePublicationView";
export default async function Page({ params }: any) {
  const publicationId = params.publicationId;

  const { body } = await FetchPublicationById({ publicationId });

  console.log(
    "============== in publication single view ============================="
  );
  console.log(body);
  return <SinglePublicationView publication={body} />;
}
