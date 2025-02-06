import fetchPublicationByDepartmentIdAndCategoryId from "../../actions/fetchPublicationBydepartmentIdAndCategoryId";
import PublicationList from "../../components/publicationList";

interface PageProps {
  params: {
    departmentId: string;
    categoryId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { body: publications } =
    await fetchPublicationByDepartmentIdAndCategoryId({
      departmentId: params.departmentId,
      categoryId: params.categoryId,
    });

  console.log("============ in fetch publication page ============");
  console.log(publications);
  let result = publications.filter(
    (pub: any) => pub.publicationType != "INTERNAL"
  );
  return <PublicationList publications={result} />;
}
