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
  return <PublicationList publications={publications} />;
}
