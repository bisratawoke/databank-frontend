// "use client";
// import React from "react";
// import { useSession } from "next-auth/react";
// import { signOut } from "next-auth/react";
// import Link from "next/link";
// import {
//   FaUser,
//   FaEnvelope,
//   FaCalendarAlt,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import Image from "next/image";

// const ProfilePage: React.FC = () => {
//   const { data: session } = useSession({
//     required: true,
//     onUnauthenticated() {
//       // Redirect to login if not authenticated
//       window.location.href = "/login";
//     },
//   });

//   if (!session) {
//     return null; // Or a loading state
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="bg-[#22407F] text-white text-center py-6">
//           <div className="flex justify-center mb-4">
//             {session.user?.image ? (
//               <Image
//                 src={session?.user?.image}
//                 alt="Profile"
//                 width={24}
//                 height={24}
//                 className="rounded-full object-cover border-4 border-white"
//               />
//             ) : (
//               <div className="w-24 h-24 bg-[#BB9271] rounded-full flex items-center justify-center">
//                 <FaUser className="w-12 h-12 text-white" />
//               </div>
//             )}
//           </div>
//           <h1 className="text-2xl font-bold">
//             {session.user?.fullName || "User Profile"}
//           </h1>
//         </div>

//         <div className="p-6">
//           <div className="mb-4 flex items-center">
//             <FaUser className="mr-4 text-[#22407F]" />
//             <div>
//               <p className="text-gray-600 text-sm">Full Name</p>
//               <p className="font-semibold">
//                 {session.user?.fullName || "Not provided"}
//               </p>
//             </div>
//           </div>

//           <div className="mb-4 flex items-center">
//             <FaEnvelope className="mr-4 text-[#22407F]" />
//             <div>
//               <p className="text-gray-600 text-sm">Email</p>
//               <p className="font-semibold">
//                 {session.user?.email || "Not provided"}
//               </p>
//             </div>
//           </div>

//           <div className="mb-4 flex items-center">
//             <FaCalendarAlt className="mr-4 text-[#22407F]" />
//             <div>
//               <p className="text-gray-600 text-sm">Account Created</p>
//               <p className="font-semibold">
//                 {session.user?.createdAt
//                   ? new Date(session.user.createdAt).toLocaleDateString()
//                   : "Not available"}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 flex space-x-4">
//             <Link
//               href="/edit-profile"
//               className="flex-1 bg-[#BB9271] text-white py-2 px-4 rounded-lg text-center hover:bg-[#a47c61] transition"
//             >
//               Edit Profile
//             </Link>
//             <button
//               onClick={() => signOut({ callbackUrl: "/" })}
//               className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-600 transition"
//             >
//               <FaSignOutAlt className="mr-2" /> Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBuilding,
  FaPhone,
  FaUserTag,
} from "react-icons/fa";
import Image from "next/image";

interface UserDetails {
  _id?: string;
  userType?: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  isVerified?: boolean;
  roles?: string[];
  createdAt?: string;
}

interface ProfilePageProps {
  user: UserDetails | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user: userDetails }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#22407F] text-white text-center py-6">
          <div className="flex justify-center mb-4">
            {session.user?.image ? (
              <Image
                src={session?.user?.image}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 bg-[#BB9271] rounded-full flex items-center justify-center">
                <FaUser className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {userDetails?.fullName || "User Profile"}
          </h1>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center">
            <FaUser className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="font-semibold">
                {userDetails?.fullName || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaEnvelope className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold">
                {userDetails?.email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaBuilding className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Company</p>
              <p className="font-semibold">
                {userDetails?.companyName || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaPhone className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="font-semibold">
                {userDetails?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaUserTag className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">User Type</p>
              <p className="font-semibold">
                {userDetails?.userType || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaCalendarAlt className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Account Created</p>
              <p className="font-semibold">
                {userDetails?.createdAt
                  ? new Date(userDetails.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <FaUserTag className="mr-4 text-[#22407F]" />
            <div>
              <p className="text-gray-600 text-sm">Verification Status</p>
              <p className="font-semibold">
                {userDetails?.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            {/* <Link
              href="/edit-profile"
              className="flex-1 bg-[#BB9271] text-white py-2 px-4 rounded-lg text-center hover:bg-[#a47c61] transition"
            >
              Edit Profile
            </Link> */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
