"use client"; // Mark this file as a client component

import React from "react";
import { Tabs } from "antd";
import { useRouter, usePathname } from "next/navigation";

const { TabPane } = Tabs;

const TabsNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Map routes to tab keys
  const tabItems = [
    {
      label: "Edit Profile",
      key: "/user/profile/profile/edit-profile",
      route: "/user/profile/profile/edit-profile",
    },
    {
      label: "Change Password",
      key: "/user/profile/profile/change-password",
      route: "/user/profile/profile/change-password",
    },
  ];

  // Determine active tab based on pathname
  const activeTabKey =
    tabItems.find((item) => pathname === item.route)?.key || "/";

  const handleTabChange = (key: string) => {
    const selectedTab = tabItems.find((item) => item.key === key);
    if (selectedTab) {
      router.push(selectedTab.route);
    }
  };

  return (
    <Tabs
      activeKey={activeTabKey}
      onChange={handleTabChange}
      style={{ marginBottom: 16 }}
    >
      {tabItems.map((item) => (
        <TabPane tab={item.label} key={item.key} />
      ))}
    </Tabs>
  );
};

export default TabsNav;
