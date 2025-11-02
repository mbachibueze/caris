"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/ui/dashboardNav";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation"; // ✅ Added

interface History {
  id: string;
  childId: string;
  childName: string;
  parentUid: string;
  parentName: string;
  doctorUid: string;
  doctorName?: string;
  completedBy?: string;
  completedByName?: string;
  vaccination: string;
  appointmentDate: string;
  appointmentTime: string;
  completedAt?: string;
  status: string;
}

const History = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<History[]>([]);
  // const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const isParentPage = pathname.includes("parent");
  const isDoctorPage = pathname.includes("doctor");

  // ✅ Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return unsubscribe;
  }, []);

  // ✅ Fetch completed records for both parent & doctor
  useEffect(() => {
    if (!userId) return;

    const historyRef = collection(db, "history");
    const q = query(
      historyRef,
      where("status", "==", "completed"),
      orderBy("completedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: History[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as History;
        if (data.parentUid === userId || data.doctorUid === userId) {
          records.push({
            ...data,
            id: doc.id,
            completedAt: data.completedAt
              ? new Date(data.completedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "—",
          });
        }
      });
      setHistoryData(records);
    });

    return () => unsubscribe();
  }, [userId]);

  // ✅ Loading state
  // if (loading) {
  //   return (
  //     <div>
  //       <DashboardNav title="History" />
  //       <div className="p-6 text-center text-gray-500">Loading history...</div>
  //     </div>
  //   );
  // }

  // ✅ Empty state
  if (historyData.length === 0) {
    return (
      <div>
        <DashboardNav title="History" />
        <div className="p-6 text-center text-gray-500">
          No completed vaccination records found.
        </div>
      </div>
    );
  }

  // ✅ Main return
  return (
    <div>
      <DashboardNav title="History" />
      <main className="p-4 space-y-4">
        <h1 className="font-semibold text-xl text-[#142257] mb-3">
          Completed Vaccinations
        </h1>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
          {historyData.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg w-full flex flex-col shadow-md p-4 hover:shadow-lg transition cursor-pointer [&_p]:text-sm"
            >
              <h2 className="font-semibold text-lg text-[#1739b6] mb-2">
                {record.childName}
              </h2>

              {/* ✅ Show Doctor name for Parent Page */}
              {isParentPage && (
                <p>
                  <strong>Doctor:</strong>{" "}
                  {record.completedByName || record.doctorName || "N/A"}
                </p>
              )}

              {/* ✅ Show Parent name for Doctor Page */}
              {isDoctorPage && (
                <p>
                  <strong>Parent:</strong> {record.parentName || "N/A"}
                </p>
              )}

              <p>
                <strong>Vaccination:</strong> {record.vaccination}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(record.appointmentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <p>
                <strong>Appointment Time:</strong>{" "}
                {new Date(
                  `${record.appointmentDate}T${record.appointmentTime}`,
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>

              <p>
                <strong>Completed At:</strong> {record.completedAt}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`capitalize font-medium ${
                    record.status === "completed"
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {record.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;
