import getLoggedInUser from "../actions/getCurrentUser";
import ProfilePage from "../components/ProfilePage";

export default async function Profile() {
  const { body: userDetails } = await getLoggedInUser();

  return <ProfilePage user={userDetails} />;
}
