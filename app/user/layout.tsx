export default async function Layout({
  profile,
  publication_request_status_tracker,
}: {
  profile: React.ReactNode;
  publication_request_status_tracker: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12">
      <div className="col-start-3 col-end-5">{profile}</div>
      <div className="col-start-7 col-end-13">
        {publication_request_status_tracker}
      </div>
    </div>
  );
}
