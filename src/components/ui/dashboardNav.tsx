"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiMenuFries, CiSearch, CiSettings } from "react-icons/ci";
import { IoNotifications } from "react-icons/io5";
import { MdDashboard, MdPerson } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import { HiChartBarSquare } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

type Props = { title: string };

const DashboardNav = ({ title }: Props) => {
  const pathname = usePathname();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    setUserId(storedUserId);
    setRole(storedRole);

    const fetchUserData = async () => {
      try {
        if (!storedUserId) return;

        const q = query(collection(db, "users"), where("uid", "==", storedUserId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          const userRole = userData.role;

          if (userRole === "doctor") {
            setUserName(`Dr ${userData.lastName}`);
          } else {
            setUserName(userData.firstName);
          }

          localStorage.setItem("userRole", userRole);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();

    // show welcome message briefly
    if (justLoggedIn === "true") {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem("justLoggedIn");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // ✅ Role-based navigation links
  const parentLinks = [
    { href: `/parent/dashboard/${userId}`, label: "Dashboard", icon: <MdDashboard size={20} /> },
    { href: `/parent/dashboard/${userId}/children`, label: "My Children", icon: <MdPerson size={20} /> },
    { href: `/parent/dashboard/${userId}/schedule`, label: "Appointment", icon: <GrSchedule size={18} /> },
    { href: `/parent/dashboard/${userId}/history`, label: "History", icon: <HiChartBarSquare size={20} /> },
    { href: `/parent/dashboard/${userId}/settings`, label: "Settings", icon: <CiSettings size={20} /> },
  ];

  const doctorLinks = [
    { href: `/doctor/dashboard/${userId}`, label: "Dashboard", icon: <MdDashboard size={20} /> },
    { href: `/doctor/dashboard/${userId}/children`, label: "Children", icon: <MdPerson size={20} /> },
    { href: `/doctor/dashboard/${userId}/schedule`, label: "Appointments", icon: <GrSchedule size={18} /> },
    { href: `/doctor/dashboard/${userId}/history`, label: "History", icon: <HiChartBarSquare size={20} /> },
    { href: `/doctor/dashboard/${userId}/settings`, label: "Settings", icon: <CiSettings size={20} /> },
  ];

  const links = role === "doctor" ? doctorLinks : parentLinks;

  return (
    <div className="sticky top-0 z-50 bg-gray-100">
      <nav className="sticky top-0 z-20 py-2 bg-gray-200">
      <main className="flex items-center justify-between rounded p-1 border-gray-500 bg-white shadow px-2">
        <h1 className="font-semibold capitalize text-[#1739b6]">{title}</h1>

        <div className="flex items-center gap-3 font-medium ml-auto relative">
          {/* ✅ Role-based dynamic welcome message */}
          {showWelcome && userName && (
            <h1 className="text-[#1739b6] font-semibold text-sm animate-fadeOut">
              Welcome back, {userName} 👋
            </h1>
          )}

          <div className="cursor-pointer text-[#4277DF] hover:text-[#0641B6] transition-colors duration-200">
            <IoNotifications size={18} />
          </div>

          <div className="font-semibold text-[#efefef]">
            <div className="sm:flex items-center bg-white rounded-[100px] px-1 border border-[#4277DF] hidden">
              <CiSearch color="#1b2450" size={17} />
              <input
                className="rounded-[50px] outline-none text-black px-2 py-[2px] text-sm w-0 hover:w-[150px] focus:w-[150px] font-normal transition-width duration-500"
                placeholder="Search..."
              />
            </div>
          </div>

          <Image
            src="/profile.svg"
            alt="profile"
            width={30}
            height={40}
            className="bg-red-400 rounded-full border cursor-pointer border-gray-400 shadow"
          />
        </div>
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="
            ml-2 text-xl p-1 rounded-lg bg-white/10 cursor-pointer border-gray-400 font-bold border 
            hover:border-dashed hover:text-[#1739b6] hover:border-[#1739b6] hover:bg-white/20 lg:hidden
            transition-all duration-300 ease-in-out"
        >
          <CiMenuFries size={20} />
        </div>
      </main>
    </nav>
      {/* onClick={() => setShowSidebar(!showSidebar)} */}

      {/* ✅ Sidebar (Mobile View) */}
      <aside
        className={`fixed md:hidden top-0 left-0 z-40 bg-white w-64 h-screen shadow-md transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="font-bold text-xl  text-[#327cff] flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="logo"
              width={20}
              height={20}
              className=""
            />
            <div className="flex items-center ">CareTrack</div>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-500 hover:text-[#1739b6] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-4">
          {links.map(({ href, label, icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  pathname === href
                    ? "bg-[#1739b6] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setShowSidebar(false)}
              >
                {icon}
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for closing sidebar */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default DashboardNav;
