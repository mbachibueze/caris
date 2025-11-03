"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/ui/dashboardNav";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Appointment {
  id: string;
  childId: string;
  childName: string;
  parentUid: string;
  parentName: string;
  doctorUid: string;
  doctorName: string;
  vaccination: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  completedByName?: string;
  createdAt?: string;
}

const ParentsSchedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentUid, setParentUid] = useState<string | null>(null);

  const pathname = usePathname();
  const isParentPage = pathname.includes("parent");

  // ✅ Get logged-in parent UID
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setParentUid(user.uid);
      }
    });
    return unsubscribeAuth;
  }, []);

  // ✅ Fetch appointments only for this parent
  useEffect(() => {
    if (!parentUid) return;

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("parentUid", "==", parentUid) // filter by parent
    );

    const unsub = onSnapshot(appointmentsQuery, (snapshot) => {
      const parentAppointments = snapshot.docs.map((doc) => ({
        ...(doc.data() as Appointment),
        id: doc.id,
      }));
      setAppointments(parentAppointments);
      setLoading(false);
    });

    return () => unsub();
  }, [parentUid]);

  // ✅ Handle delete appointment
  const handleDelete = async (appointmentId: string, childName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to cancel ${childName}'s appointment?`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error("🔥 Error deleting appointment:", error);
      alert("Error cancelling appointment.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen grid place-items-center">
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      <DashboardNav title="Appointments" />

      <main className="space-y-4">
        <h1 className="font-semibold text-xl text-[#142257] mb-3">
          Scheduled Appointments
        </h1>

        {appointments.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            No appointments scheduled yet.
          </p>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
            {appointments.map((appointment) => {
              const formattedDate = new Date(
                appointment.appointmentDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const fullDateTime = new Date(
                `${appointment.appointmentDate}T${appointment.appointmentTime}`
              );

              const formattedTime = fullDateTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={appointment.id}
                  className="relative bg-white rounded-lg w-full flex flex-col shadow-md p-4 hover:shadow-lg transition cursor-pointer [&_p]:text-sm"
                >
                  {/* Delete icon */}
                  <button
                    onClick={() =>
                      handleDelete(appointment.id, appointment.childName)
                    }
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition cursor-pointer"
                    title="Cancel appointment"
                  >
                    <Trash2 size={18} />
                  </button>

                  <h2 className="font-semibold text-lg text-[#1739b6] mb-2">
                    {appointment.childName}
                  </h2>
                  <p>
                    <strong>Doctor:</strong> {appointment.doctorName}
                  </p>
                  <p>
                    <strong>Vaccination:</strong> {appointment.vaccination}
                  </p>
                  <p>
                    <strong>Date:</strong> {formattedDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {formattedTime}
                  </p>

                  {isParentPage && appointment.completedByName && (
                    <p>
                      <strong>Doctor:</strong> {appointment.completedByName}
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize font-medium ${
                        appointment.status === "completed"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentsSchedule;
