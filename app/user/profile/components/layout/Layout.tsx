"use client";
import { Layout } from "antd";
import TopNavBar from "./TopNavBar";
import SideNavBar from "./SideNavBar";
import NewRequestButton from "../ui/buttons/NewRequestButton";
export default function LayoutComp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <TopNavBar />

      <Layout>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
