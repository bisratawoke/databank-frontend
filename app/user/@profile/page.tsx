import getLoggedInUser from "./actions/getCurrentUser";
import ProfilePage from "./components/ProfilePage";

export default async function Profile() {
  const { body: userDetails }: any = await getLoggedInUser();

  return <ProfilePage user={userDetails} />;
}
