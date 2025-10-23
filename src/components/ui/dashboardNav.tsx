"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoNotifications } from "react-icons/io5";

type Props = {
  title: string;
};

const DashboardNav = ({ title }: Props) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Trigger only when user just logged in
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justLoggedIn === "true") {
      setShowWelcome(true);

      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem("justLoggedIn"); // Reset flag after showing
      }, 5000); // 5 seconds display

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <main className="flex items-center justify-between rounded p-1 border-gray-500 bg-white px-2">
        <h1 className="font-semibold capitalize text-[#1739b6]">{title}</h1>

        <div className="flex items-center gap-3 font-medium ml-auto relative">
          {/* ✅ Fade-out welcome message */}
          {showWelcome && (
            <h1 className="text-[#1739b6] font-semibold text-sm animate-fadeOut">
              Welcome back, Adeshina 👋
            </h1>
          )}

          {/* Notification Bell */}
          <div className="cursor-pointer text-[#4277DF] hover:text-[#0641B6] transition-colors duration-200">
            <IoNotifications size={18} />
          </div>

          {/* Search Bar */}
          <div className="font-semibold text-[#efefef]">
            <div className="sm:flex items-center bg-white rounded-[100px] px-1 border border-[#4277DF] hidden">
              <CiSearch color="#1b2450" size={17} />
              <input className="rounded-[50px] outline-none text-black px-2 py-[2px] text-sm w-0 hover:w-[150px] focus:w-[150px] font-normal transition-width duration-500" />
            </div>
          </div>

          {/* User Image */}
          <Image
            src="/profile.svg"
            alt="profile"
            width={30}
            height={40}
            className="bg-red-400 rounded-full border cursor-pointer border-gray-400 shadow"
          />

          {/* Log Out */}
          {/* <Link href="/signIn">
            <p className="cursor-pointer hover:underline text-sm">Logout</p>
          </Link> */}
        </div>
      </main>
    </nav>
  );
};

export default DashboardNav;
