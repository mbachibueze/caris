"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/ui/dashboardNav";
import Card from "@/components/ui/cardComponent";
import { CalendarCheck, CalendarClock, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const DoctorsDashboard = () => {
  const [childrenCount, setChildrenCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // --- Load user info from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    setUserId(storedUserId);
    setRole(storedRole);
  }, []);

  // --- Real-time listeners
  useEffect(() => {
    if (!userId || !role) return;

    let childrenQuery, scheduledQuery, completedQuery;

    if (role === "doctor") {
      // ✅ Doctor dashboard: all data from the database
      childrenQuery = query(collection(db, "children"));
      scheduledQuery = query(collection(db, "appointments"));
      completedQuery = query(collection(db, "history"));
    } else {
      // ✅ Parent dashboard: filter by parentId (userId)
      childrenQuery = query(
        collection(db, "children"),
        where("parentId", "==", userId),
      );
      scheduledQuery = query(
        collection(db, "appointments"),
        where("parentId", "==", userId),
      );
      completedQuery = query(
        collection(db, "history"),
        where("parentId", "==", userId),
      );
    }

    // --- Children snapshot
    const unsubscribeChildren = onSnapshot(childrenQuery, (snapshot) => {
      setChildrenCount(snapshot.size);
    });

    // --- Scheduled appointments snapshot
    const unsubscribeScheduled = onSnapshot(scheduledQuery, (snapshot) => {
      setScheduledCount(snapshot.size);
    });

    // --- Completed vaccinations snapshot
    const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
      setCompletedCount(snapshot.size);
    });

    // Clean up listeners
    return () => {
      unsubscribeChildren();
      unsubscribeScheduled();
      unsubscribeCompleted();
    };
  }, [userId, role]);

  const cardData = [
    {
      label: "Total Children",
      icon: Users,
      amount: childrenCount.toString(),
      description:
        role === "doctor"
          ? "All registered children in the system"
          : "Your registered children",
    },
    {
      label: "Scheduled Vaccinations",
      icon: CalendarClock,
      amount: scheduledCount.toString(),
      description: "Upcoming vaccination appointments",
    },
    {
      label: "Completed Vaccinations",
      icon: CalendarCheck,
      amount: completedCount.toString(),
      description: "Vaccinations marked as completed",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* ✅ Navbar stays fixed */}
      <DashboardNav title="dashboard" />

      {/* ✅ Dashboard content */}
      <div className="flex flex-col gap-4  pb-6">
        {/* Cards */}
        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardData.map((d, i) => (
            <Card
              key={i}
              label={d.label}
              icon={d.icon}
              amount={d.amount}
              description={d.description}
            />
          ))}
        </section>

        {/* Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
          <h2 className="capitalize font-semibold">vaccinations chart</h2>
          <div className="w-full h-44 mt-4 flex items-center justify-center text-gray-400">
            {/* Placeholder until chart is ready */}
            Coming soon...
          </div>
        </div>

        {/* My children */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
          <h2 className="capitalize font-semibold">
            {role === "doctor" ? "all children" : "my children"}
          </h2>
          <div className="w-full h-44 mt-4 flex items-center justify-center text-gray-400">
            {/* Placeholder until data list is integrated */}
            Coming soon...
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorsDashboard;
