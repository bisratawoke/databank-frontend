import React from "react";
import TabsNav from "../components/layout/TabsNav"; // Import the TabsNav component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-12 py-10 px-20 bg-white">
      <div className="col-start-3 col-end-10">
        <TabsNav />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
