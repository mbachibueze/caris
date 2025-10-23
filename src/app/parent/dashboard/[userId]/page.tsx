"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardNav from "@/components/ui/dashboardNav";

interface UserData {
  email: string;
  createdAt: number | string;
}

const ParentDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", userId as string);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data() as UserData);
        } else {
          console.error("No user found!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <main className="min-h-screen flex flex-col gap-2">
      <DashboardNav title="dashboard" />

      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1739b6]"> </h1>
        <section className="grid w-full grid-cols-1 gap-4 lg:gap-3 gap-x-8 transition-all duration-600 sm:grid-cols-2 lg:grid-cols-3">
        {cardData.map((d,i)=> (
          <Card key={i}
            label={d.label}
            icon={d.icon}
            amount={d.amount}
            description={d.description}
          />
        ))}
      </section>
      </div> */}

      {user ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-fit">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No user data found.</p>
      )}

      <h1 className="font-semibold text-lg ">Dashboard</h1>
    </main>
  );
};

export default ParentDashboard;
