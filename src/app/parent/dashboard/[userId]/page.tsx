"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/ui/dashboardNav";
import Card from "@/components/ui/cardComponent";
import { CalendarCheck, CalendarClock, Users } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ParentsDashboard = () => {
  const [childrenCount, setChildrenCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [parentUid, setParentUid] = useState<string | null>(null);

  // ✅ Track logged-in parent
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setParentUid(user.uid);
      }
    });

    return unsubscribeAuth;
  }, []);

  // ✅ Real-time counts filtered by parent UID
  useEffect(() => {
    if (!parentUid) return;

    
    // --- Children
    const childrenQuery = query(
      collection(db, "children"),
      where("parentUid", "==", parentUid)
    );
    const unsubscribeChildren = onSnapshot(childrenQuery, (snapshot) => {
      setChildrenCount(snapshot.size);
    });

    // --- Scheduled appointments
    const scheduledQuery = query(
      collection(db, "appointments"),
      where("parentUid", "==", parentUid)
    );
    const unsubscribeScheduled = onSnapshot(scheduledQuery, (snapshot) => {
      setScheduledCount(snapshot.size);
    });

    // --- Completed vaccinations (history)
    const completedQuery = query(
      collection(db, "history"),
      where("parentUid", "==", parentUid)
    );
    const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
      setCompletedCount(snapshot.size);
    });

    return () => {
      unsubscribeChildren();
      unsubscribeScheduled();
      unsubscribeCompleted();
    };
  }, [parentUid]);

  const cardData = [
    {
      label: "Total Children",
      icon: Users,
      amount: childrenCount.toString(),
      description: "Your registered children",
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
      <DashboardNav title="dashboard" />

      <div className="flex flex-col gap-4 pb-6">
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
            Coming soon...
          </div>
        </div>

        {/* My children */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
          <h2 className="capitalize font-semibold">my children</h2>
          <div className="w-full h-44 mt-4 flex items-center justify-center text-gray-400">
            Coming soon...
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentsDashboard;
