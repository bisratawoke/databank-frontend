import fetchCategories from "../actions/fetchCategories";
import PublicationRequestForm from "../components/PublicationRequestForm";

export default async function Post() {
  const { body: categories } = await fetchCategories();

  return <PublicationRequestForm categories={categories} />;
}
