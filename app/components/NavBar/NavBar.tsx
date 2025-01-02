"use client";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Collapse, Drawer, Dropdown, Row, Col, Input } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import UserProfileDropdown from "./ProfileMenu";
import { usePathname } from "next/navigation";
const { Panel } = Collapse;
const { Search } = Input;

// Define the type for menu items
interface MenuItem {
  name: string;
  link?: string;
  submenu?: MenuItem[];
}

const MenuItems: MenuItem[] = [
  { name: "Home", link: "/" },
  {
    name: "About ESS",
    submenu: [
      { name: "About ESS", link: "/about" },
      { name: "History", link: "/history" },
      { name: "Organization Structure", link: "/organization-structure" },
      { name: "Statistics Act", link: "/statistics-act" },
      { name: "Proclamation", link: "/proclamation" },
      { name: "Strategies", link: "/strategies" },
      {
        name: "Statistics For Results (SFR)",
        submenu: [
          { name: "SFR Audit Report", link: "/sfr-audit-report" },
          { name: "SFR Activities", link: "/sfr-activities" },
          {
            name: "National Statistics Abstract (2003-15)",
            link: "/statistics-abstract",
          },
          { name: "Links of Related Organization", link: "/related-links" },
        ],
      },
      {
        name: "More",
        submenu: [
          { name: "Branch Offices", link: "/branch-offices" },
          { name: "Contact Us", link: "/contact-us" },
          { name: "Vacancies & Internship", link: "/vacancies-internship" },
          { name: "Bid", link: "/bid" },
        ],
      },
    ],
  },
  { name: "Publication", link: "/publication" },
  {
    name: "Find Statistics",
    submenu: [
      {
        name: "Surveys",
        submenu: [
          { name: "Agricultural", link: "/surveys/agricultural" },
          { name: "Labour Force", link: "/surveys/labour-force" },
          { name: "Livestock", link: "/surveys/livestock" },
        ],
      },
      {
        name: "Census",
        submenu: [
          { name: "Population & Housing", link: "/census/population-housing" },
          { name: "Business", link: "/census/business" },
          { name: "Household", link: "/census/household" },
        ],
      },
      {
        name: "Price",
        submenu: [
          { name: "Monthly Retail Price", link: "/price/monthly" },
          { name: "Quarterly Price Index", link: "/price/quarterly" },
          { name: "Annually Price Index", link: "/price/annually" },
        ],
      },
    ],
  },
  { name: "Data Portal", link: "/data-portal" },
  {
    name: "Media",
    submenu: [
      { name: "News ESS", link: "/news" },
      { name: "Events", link: "/events" },
      { name: "Photo Gallery", link: "/photo-gallery" },
      { name: "Video Gallery", link: "/video-gallery" },
    ],
  },
];

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const [visible, setVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setVisible(true);
  };

  const closeDrawer = (): void => {
    setVisible(false);
  };

  const onSearch = (value: string): void => {
    console.log(value);
  };

  const renderMenuItems = (items: MenuItem[]): JSX.Element[] =>
    items.map((item) => {
      if (item.submenu) {
        return (
          <Dropdown
            key={item.name}
            menu={{
              items: item.submenu.map((subitem) => ({
                key: subitem.name,
                label: subitem.link ? (
                  <Link href={subitem.link}>{subitem.name}</Link>
                ) : (
                  <span>{subitem.name}</span>
                ),
              })),
            }}
            trigger={["hover"]}
          >
            <span className="ant-dropdown-link text-white lg:mx-[2.5%] xl:mx-[3%] 2xl:mx-[5%] hover:bg-[#BB9271] hover:text-white py-2 px-3">
              {item.name} <DownOutlined />
            </span>
          </Dropdown>
        );
      }
      return item.link ? (
        <Link
          key={item.name}
          href={item.link}
          className="text-white lg:mx-[1%] xl:mx-[1%] hover:bg-[#BB9271] hover:text-white py-2 px-3 block"
        >
          {item.name}
        </Link>
      ) : (
        <span
          key={item.name}
          className="text-white lg:mx-[1%] xl:mx-[1%] py-2 px-3 block"
        >
          {item.name}
        </span>
      );
    });

  const renderMobileMenu = (items: MenuItem[]): JSX.Element[] =>
    items.map((item, index) => {
      if (item.submenu) {
        return (
          <Collapse
            ghost
            key={index} // Unique key for the parent Panel
            expandIcon={({ isActive }) => (
              <DownOutlined rotate={isActive ? 180 : 0} />
            )}
            expandIconPosition="end"
          >
            <Panel
              header={item.name}
              className="font-semibold"
              key={`panel-${index}`}
            >
              {item.submenu.map((subitem, subindex) => {
                if (subitem.submenu) {
                  return (
                    <Collapse
                      ghost
                      key={subindex} // Unique key for the nested Collapse
                      expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                      )}
                      expandIconPosition="end"
                    >
                      <Panel
                        header={subitem.name}
                        className="font-normal"
                        key={`subpanel-${subindex}`} // Unique key for the nested Panel
                      >
                        {subitem.submenu.map((subsubitem, subsubindex) =>
                          subsubitem.link ? (
                            <Link
                              key={`link-${subsubindex}`}
                              href={subsubitem.link}
                            >
                              {subsubitem.name}
                            </Link>
                          ) : (
                            <span key={`span-${subsubindex}`}>
                              {subsubitem.name}
                            </span>
                          )
                        )}
                      </Panel>
                    </Collapse>
                  );
                }
                return subitem.link ? (
                  <Link key={`link-${subindex}`} href={subitem.link}>
                    {subitem.name}
                  </Link>
                ) : (
                  <span key={`span-${subindex}`}>{subitem.name}</span>
                );
              })}
            </Panel>
          </Collapse>
        );
      }
      return item.link ? (
        <Link
          key={index}
          href={item.link}
          className="block py-2 text-lg font-semibold text-left"
        >
          {item.name}
        </Link>
      ) : (
        <span
          key={index}
          className="block py-2 text-lg font-semibold text-left"
        >
          {item.name}
        </span>
      );
    });
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return <></>;
  } else
    return (
      <>
        <div className="bg-navbarbackground w-full px-[5%] md:px-[10%] lg:px-[12%] xl:px-[16%]">
          <Row justify="space-between" align="middle" className="py-2">
            {/* Logo Section */}
            <Col xs={12} lg={4}>
              <Image
                src="/images/ess-logo-desc-1.svg"
                width={208}
                height={66}
                alt="Logo"
                className="min-h-[42] min-w-[208px] sm:w-56 md:w-64 lg:w-64 xl:w-80"
                priority
              />
            </Col>

            {/* Search Input */}
            {/* <Col xs={8} lg={6} className="hidden lg:block">
            <Search
              placeholder="Search..."
              onSearch={onSearch}
              allowClear
              enterButton={
                <Button
                  style={{
                    backgroundColor: "#BB9271",
                    color: "white",
                    border: "none",
                    borderTopRightRadius: "50px",
                    borderBottomRightRadius: "50px",
                  }}
                >
                  <AiOutlineSearch size={20} />
                </Button>
              }
            />
          </Col> */}

            {/* User/Social Section */}
            <Col
              xs={4}
              lg={4}
              className="text-right flex justify-end items-center space-x-2"
            >
              {/* Social Icons */}
              {/* <div className="hidden lg:flex space-x-2 mr-4">
              <Link href="https://facebook.com" passHref>
                <FaFacebook className="rounded-full bg-[#224986] p-2 text-2xl text-white transition-colors duration-300 hover:bg-[#BB9271] md:text-3xl" />
              </Link>
              <Link href="https://telegram.org" passHref>
                <FaTelegram className="rounded-full bg-[#224986] p-2 text-2xl text-white transition-colors duration-300 hover:bg-[#BB9271] md:text-3xl" />
              </Link>
            </div> */}

              {/* User Authentication */}
              {session ? (
                <div className="flex justify-end">
                  <UserProfileDropdown session={session} />
                </div>
              ) : (
                <Button
                  className="bg-[#BB9271] text-white hover:bg-[#a47c61]"
                  onClick={() => signIn()}
                >
                  Login
                </Button>
              )}
            </Col>

            {/* Mobile Menu Toggle */}
            <Col className="lg:hidden">
              <Button
                type="text"
                icon={<MenuOutlined className="text-white" />}
                onClick={showDrawer}
                style={{ color: "gold" }}
              />
            </Col>
          </Row>
        </div>
        {!pathname.startsWith("/user/profile") && (
          <nav className="bg-[#22407F] w-full px-[5%] md:px-[10%] lg:px-[15%] xl:px-[20%]">
            {/* Desktop Menu */}
            <Row justify="center" className="hidden lg:flex py-2">
              {renderMenuItems(MenuItems)}
            </Row>

            {/* Mobile Drawer Menu */}
            <Drawer
              title="Menu"
              placement="right"
              onClose={closeDrawer}
              open={visible}
            >
              {renderMobileMenu(MenuItems)}
            </Drawer>
          </nav>
        )}
      </>
    );
};

export default NavBar;
