"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import { GoSignOut } from "react-icons/go";

export interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  title?: string;
  logoutHref?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  links,
  title = "Caris+",
  logoutHref = "/signIn",
}) => {
  const pathname = usePathname();

  return (
    <aside className="bg-[#327cff] w-fit text-white p-6 pt-2 pr-0 space-y-4 relative">
      <div className="font-bold text-2xl uppercase text-[#ffffff] flex items-center">
        {title.includes("+") ? (
          <>
            {title.split("+")[0]} <p className="font-bold text-[#bcdaff]">+</p>
          </>
        ) : (
          <>{title}</>
        )}
      </div>

      <nav
        className="h-[87%] flex flex-col 
        [&_a]:p-2 [&_a]:pr-5 [&_a]:rounded-l-lg 
        [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:font-medium 
        [&_p]:sm:hidden [&_p]:lg:block"
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
              <p>{link.label}</p>
            </Link>
          );
        })}

        <Link
          href={logoutHref}
          className="mt-auto text-white hover:bg-[#5199ff] hover:text-white flex items-center gap-2 p-2 pr-5 rounded-l-lg"
        >
          <GoSignOut size={20} />
          <p>Logout</p>
        </Link>
      </nav>

      {/* toggleBtn */}
      <button>
        <CiMenuFries
          size={20}
          className="bg-[#327cff] text-white rounded border border-white p-1 absolute top-3 right-[-5px] shadow cursor-pointer"
        />
      </button>
    </aside>
  );
};

export default Sidebar;
