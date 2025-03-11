// import DepartmentsPage from "./departments/page";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const fetchDepartments = async (): Promise<any[]> => {
//   const res = await fetch(`${API_URL}/departments/all`, {
//     cache: "no-store", // To avoid caching during development
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return res.json();
// };

// export default async function Home() {
//   const departmentsData = await fetchDepartments();
//   const departments = departmentsData.departments;

//   return (
//     <>
//       {/* <InfoSection /> */}
//       {/* <DepartmentsLists departments={departments} /> */}
//       {/* <HomePage /> */}
//       <DepartmentsPage departments={departments} />
//     </>
//   );
// }

import DepartmentsPage from "./departments/page";

export const metadata = {
  title: "Departments | My Company",
  description:
    "Discover the various departments within our company. Explore our teams, learn about our expertise, and see how we work together to deliver excellence.",
  keywords: "departments, company, teams, organization, business",
  openGraph: {
    title: "Departments | My Company",
    description:
      "Discover the various departments within our company. Explore our teams, learn about our expertise, and see how we work together to deliver excellence.",
    url: "https://www.example.com/departments", // update this URL
    siteName: "My Company",
    images: [
      {
        url: "https://www.example.com/og-image.jpg", // update with your image URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Departments | My Company",
    description:
      "Discover the various departments within our company. Explore our teams, learn about our expertise, and see how we work together to deliver excellence.",
    images: ["https://www.example.com/og-image.jpg"], // update with your image URL
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchDepartments = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/departments/all`, {
    cache: "no-store", // To avoid caching during development
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default async function Home() {
  const departmentsData = await fetchDepartments();
  const departments = departmentsData.departments;

  return (
    <>
      <DepartmentsPage departments={departments} />
    </>
  );
}
