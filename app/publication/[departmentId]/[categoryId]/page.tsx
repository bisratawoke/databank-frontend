import fetchPublicationByDepartmentIdAndCategoryId from "../../actions/fetchPublicationBydepartmentIdAndCategoryId";
import PublicationList from "../../components/publicationList";

interface PageProps {
  params: {
    departmentId: string;
    categoryId: string;
  };
}

export default async function Page({ params }: PageProps) {
  console.log(
    "=========== in publication by department id and category ID ================="
  );

  const { body: publications } =
    await fetchPublicationByDepartmentIdAndCategoryId({
      departmentId: params.departmentId,
      categoryId: params.categoryId,
    });
  console.log(publications);
  return <PublicationList publications={publications} />;
}
