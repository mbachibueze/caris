"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/ui/dashboardNav";
import {
  collection,
  onSnapshot,
  deleteDoc,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react"; // ✅ Delete icon

interface Appointment {
  id: string;
  childId: string;
  childName: string;
  parentUid: string;
  parentName: string;
  doctorUid: string;
  vaccination: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  completedByName?: string;
  createdAt?: string;
}

const Schedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorUid, setDoctorUid] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const pathname = usePathname();
  const isParentPage = pathname.includes("parent");
  const isDoctorPage = pathname.includes("doctor");

  // ✅ Track logged-in doctor and fetch their name
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setDoctorUid(user.uid);

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          if (userData.role === "doctor") {
            const fullName = `Dr ${userData.lastName || ""} ${
              userData.firstName || ""
            }`.trim();
            setDoctorName(fullName);
            localStorage.setItem("userRole", userData.role);
          }
        }
      }
    });

    return unsubscribeAuth;
  }, []);

  // ✅ Fetch appointments in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const allAppointments = snapshot.docs.map((doc) => ({
        ...(doc.data() as Appointment),
        id: doc.id,
      }));
      setAppointments(allAppointments);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ Handle completion
  const handleComplete = async (appointment: Appointment) => {
    const confirmAction = confirm(
      `Mark appointment for ${appointment.childName} as completed?`,
    );
    if (!confirmAction) return;

    try {
      const completedAppointment = {
        ...appointment,
        status: "completed",
        completedAt: new Date().toISOString(),
        completedBy: doctorUid,
        completedByName: doctorName,
      };

      await addDoc(collection(db, "history"), completedAppointment);
      await updateDoc(doc(db, "appointments", appointment.id), {
        status: "completed",
      });
      await deleteDoc(doc(db, "appointments", appointment.id));

      alert("Appointment marked as completed and moved to history.");
    } catch (error) {
      console.error("🔥 Error marking as completed:", error);
      alert("Error marking appointment as completed.");
    }
  };

  // ✅ Handle delete appointment
  const handleDelete = async (appointmentId: string, childName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to cancel ${childName}'s appointment?`,
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
                appointment.appointmentDate,
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const fullDateTime = new Date(
                `${appointment.appointmentDate}T${appointment.appointmentTime}`,
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
                  {/* ✅ Delete icon */}
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
                    <strong>Parent:</strong> {appointment.parentName}
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

                  {isDoctorPage && (
                    <button
                      onClick={() => handleComplete(appointment)}
                      className="border mt-3 ml-auto w-fit cursor-pointer text-sm px-3 py-1 rounded-full glass3"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedule;
