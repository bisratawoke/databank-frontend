import React from "react";
import { Dropdown } from "antd";
import { signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

interface UserProfileDropdownProps {
  session: any;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  session,
}) => {
  // Function to get initials or first letter of name/email
  const getInitials = (name?: string | null) => {
    if (!name) return <FaUser />;

    // Try to get initials
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return initials || <FaUser />;
  };

  // Dropdown menu items
  const menuItems = [
    {
      key: "profile",
      label: (
        <Link href="/user/profile" className="flex items-center space-x-2">
          <FaUser className="mr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <span
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </span>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomLeft"
      dropdownRender={(menu) => (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {menu}
        </div>
      )}
    >
      <div
        className="w-10 h-10 rounded-full bg-[#224986] text-white 
        flex items-center justify-center cursor-pointer 
        hover:bg-[#a47c61] transition-colors duration-300 
        font-semibold text-lg"
      >
        {getInitials(session.user?.fullName || session.user?.email)}
      </div>
    </Dropdown>
  );
};

export default UserProfileDropdown;
