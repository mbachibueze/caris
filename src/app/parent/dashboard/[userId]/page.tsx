"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardNav from "@/components/ui/dashboardNav";
import Card from "@/components/ui/cardComponent";
import { CalendarCheck, CalendarClock, Users } from "lucide-react";


interface UserData {
  email: string;
  createdAt: number | string;
}

const ParentDashboard = () => {
  const { userId } = useParams();
  // const [user, setUser] = useState<UserData | null>(null);
  // const [loading, setLoading] = useState(true);



  // if (loading) return <p className="text-center mt-10 grid place-items-center h-screen">Loading dashboard...</p>;

  const cardData = [
    {
      label: "Total Children",
      icon: Users,
      amount: "150",
      description: "Number of registered children",
    },
    {
      label: "Scheduled Vaccinations",
      icon: CalendarClock,
      amount: "5",
      description: "Upcoming vaccination appointments",
    },
    {
      label: "Completed Vaccinations",
      icon: CalendarCheck,
      amount: "12",
      description: "Total vaccinations administered",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col ">
      <DashboardNav title="dashboard" />

      <div className="flex flex-col gap-3 ">
        {/* Cards */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1739b6]"> </h1>
          <section className="grid w-full grid-cols-1 gap-4 lg:gap-3  transition-all duration-600 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        {/* Chart */}
        <div className="bg-white p-3 rounded-xl shadow-md w-full">
          <h2 className=" capitalize font-semibold ">vaccinations chart</h2>
          <div className="w-full h-44 mt-4">{/* <VaccinationChart /> */}</div>
        </div>

        {/* My children */}
        <div className="bg-white p-3 rounded-xl shadow-md w-full">
          <h2 className=" capitalize font-semibold ">my children</h2>
          <div className="w-full h-44 mt-4">{/* <MyChildren /> */}</div>
        </div>
      </div>

    </main>
  );
};

export default ParentDashboard;
