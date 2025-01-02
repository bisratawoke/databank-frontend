import UserProfileCard from "../components/UserProfileCard";
import fetchUserInfo from "./actions/fetchUserInfo";

export default async function EditProfile() {
  const { data } = await fetchUserInfo();
  console.log(data);
  return <UserProfileCard profileInfo={data} />;
}
