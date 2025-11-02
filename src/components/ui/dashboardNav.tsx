"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { IoNotifications } from "react-icons/io5";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

type Props = { title: string };

const DashboardNav = ({ title }: Props) => {
  const { id } = useParams();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [_role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    const storedRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId") || (id as string);

    setRole(storedRole);

    const fetchUserData = async () => {
      try {
        if (!userId) return;

        // ✅ All users are stored in "users"
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          const userRole = userData.role;

          if (userRole === "doctor") {
            setUserName(`Dr ${userData.lastName}`);
          } else {
            setUserName(userData.firstName);
          }

          // ensure consistency in localStorage
          localStorage.setItem("userRole", userRole);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();

    // Show "Welcome" only when just logged in
    if (justLoggedIn === "true") {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem("justLoggedIn");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [id]);

  return (
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
          className="
            ml-2 text-xl p-1 rounded-lg bg-white/10 cursor-pointer border-gray-400 font-bold border 
            hover:border-dashed hover:text-[#1739b6] hover:border-[#1739b6] hover:bg-white/20 lg:hidden
            transition-all duration-300 ease-in-out"
        >
          <CiMenuFries size={20} />
        </div>
      </main>
    </nav>
  );
};

export default DashboardNav;
