"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { GoSignOut } from "react-icons/go";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

export interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  logoutHref?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ links, logoutHref = "/signIn" }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [showText, setShowText] = React.useState(true);

  const toggleSidebar = () => {
    if (!isCollapsed) {
      setShowText(false);
    } else {
      setTimeout(() => setShowText(true), 950);
    }
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`bg-[#327cff] text-white p-3 pt-2  space-y-4 sticky h-full transition-all duration-1000 ${
        isCollapsed ? "w-16" : "w-55"
      }`}
    >
      <div className={`font-bold text-xl flex pl-2 items-center gap-2     `}>
        <Image
          src="/dashboardLogo.svg"
          alt="logo"
          width={23}
          height={23}
          className=""
        />
        <div
          className={`flex items-center transition-opacity duration-700 ease-in-out ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          CareTrack
        </div>
      </div>

      <nav
        className={`h-[87%] flex flex-col 
        [&_a]:p-2 [&_a]:pl-2 [&_a]:rounded-lg 
        [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:font-medium 
          `}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-all duration-200 ${
                isActive
                  ? "bg-gray-200 text-[#1739b6] font-semibold"
                  : "text-white hover:bg-[#5199ff] hover:text-white"
              }`}
            >
              {link.icon}
              {showText && (
                <p
                  className={`transition-all  duration-700 ease-in-out ${
                    isCollapsed ? "opacity-0 " : "opacity-100 "
                  }`}
                >
                  {link.label}
                </p>
              )}
            </Link>
          );
        })}

        <Link
          href={logoutHref}
          className="mt-auto text-white hover:bg-[#5199ff] hover:text-white flex items-center gap-2 p-2 pr-5 rounded-l-lg"
        >
          <GoSignOut size={20} />
          {showText && <p>Logout</p>}
        </Link>
      </nav>

      {/* toggleBtn */}
      <button onClick={toggleSidebar}>
        {isCollapsed ? (
          <FaAngleDoubleRight
            size={22}
            className="bg-[#327cff] text-white rounded border border-white p-1 absolute top-3 right-[-6px] shadow cursor-pointer"
          />
        ) : (
          <FaAngleDoubleLeft
            size={22}
            className="bg-[#327cff] text-white rounded border border-white p-1 absolute top-3 right-[-6px] shadow cursor-pointer"
          />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
// <ChevronsRight />
