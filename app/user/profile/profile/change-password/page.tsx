import fetchUserInfo from "../edit-profile/actions/fetchUserInfo";
import ChangePasswordForm from "./components/ChangePasswordForm";

export default async function ChangePassword() {
  const { data } = await fetchUserInfo();
  return <ChangePasswordForm data={data} />;
}
