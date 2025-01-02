import AccountIcon from "../ui/icons/accountIcon";
import DatabaseIcon from "../ui/icons/databaseIcon";
import LogoutIcon from "../ui/icons/logoutIcon";
import LinkButton, { ILink } from "../ui/buttons/LinkButton";

export default function TopNavBar() {
  const mainLinks: ILink[] = [
    {
      href: "/user/profile/dashboard",
      text: "Data Request",
      startIcon: <DatabaseIcon />,
    },
    {
      href: "/user/profile/profile",
      text: "Profile",
      startIcon: <AccountIcon />,
    },
  ];
  return (
    <div className="grid grid-cols-12 bg-[#1E50A0] h-[47px]">
      <div className="col-start-3 col-end-11 flex items-center justify-between">
        <div className="flex items-center justify-center">
          {mainLinks.map((link, index) => (
            <LinkButton {...link} key={index} />
          ))}
        </div>
        <div className="flex">
          <LinkButton href={""} text={"Logout"} startIcon={<LogoutIcon />} />
        </div>
      </div>
    </div>
  );
}
