export default function Page({
  searchParams,
}: {
  searchParams: Record<string, any>;
}) {
  console.log("========== in innner page========");
  console.log(searchParams);
  return <div>Inner</div>;
}
