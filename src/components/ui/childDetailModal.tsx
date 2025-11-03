"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";



interface ChildDetails {
  id?: string;
  childName?: string;
  dateOfBirth?: string;
  gender?: string;
  birthWeight?: string;
  bloodGroup?: string;
  vaccinationStatus?: string;
  allergies?: string;
  medicalConditions?: string;
  currentMedications?: string;
  placeOfBirth?: string;
  deliveryType?: string;
  parentName?: string;
  parentUid?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ChildDetailsModalProps {
  child: ChildDetails;
  onClose: () => void;
  onDelete?: () => void;
}

export default function ChildDetailsModal({
  child,
  onClose,
}: ChildDetailsModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [vaccination, setVaccination] = useState("");

  const pathname = usePathname();
  const isParentPage = pathname.includes("/parent");
  const isDoctorPage = pathname.includes("/doctor");

  // ✅ Track logged-in doctor and fetch their name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        // Fetch doctor's full name if on doctor page
        if (isDoctorPage) {
          const q = query(
            collection(db, "users"),
            where("uid", "==", user.uid),
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            const fullName = `Dr ${data.lastName} ${data.firstName}`;
            setDoctorName(fullName);
          }
        }
      }
    });
    return unsubscribe;
  }, [isDoctorPage]);

  // ✅ Handle delete (for parent)
  const handleDelete = async () => {
    if (!userId || !child.id) {
      alert("Missing user or child ID.");
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${child.childName}'s record from the system?`,
    );
    if (!confirmDelete) return;

    setLoading(true);

    try {
      // --- 1. Delete from children collection
      await deleteDoc(doc(db, "children", child.id));

      // --- 2. Delete any appointments for this child
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("childId", "==", child.id),
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentDeletes = appointmentsSnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "appointments", docSnap.id)),
      );
      await Promise.all(appointmentDeletes);

      // --- 3. Delete any history entries for this child
      const historyQuery = query(
        collection(db, "history"),
        where("childId", "==", child.id),
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyDeletes = historySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "history", docSnap.id)),
      );
      await Promise.all(historyDeletes);

      alert(
        `${child.childName}'s record has been fully deleted from the system.`,
      );
      onClose();
    } catch (error) {
      console.error("🔥 Error deleting child:", error);
      alert("Failed to delete child completely. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Handle appointment creation (for doctor)
  const handleSetAppointment = async () => {
    if (!child.id || !appointmentDate || !appointmentTime || !vaccination) {
      alert("Please fill in all appointment fields.");
      return;
    }

    if (isDoctorPage && !doctorName) {
      alert("Unable to fetch doctor's name. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        childId: child.id,
        childName: child.childName,
        parentName: child.parentName,
        parentUid: child.parentUid,
        doctorUid: userId,
        doctorName: doctorName, // ✅ Add doctor’s full name
        vaccination,
        appointmentDate,
        appointmentTime,
        createdAt: serverTimestamp(),
        status: "scheduled",
      });


      alert(
        `Appointment for ${child.parentName}'s child ${child.childName} has been scheduled successfully`,
      );

      setShowAppointmentForm(false);
      setAppointmentDate("");
      setAppointmentTime("");
      setVaccination("");
      onClose();
    } catch (error) {
      console.error("🔥 Error scheduling appointment:", error);
      alert("Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
      <div className="glass w-[90%] max-w-lg rounded-lg p-6 overflow-y-auto max-h-[90vh] shadow-lg">
        <div className="flex flex-col justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {`${child.childName}'s Details`}
          </h2>
          {isDoctorPage && <p className="text-sm italic">{child.parentName}</p>}
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Date of Birth:</strong> {child.dateOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {child.gender}
            </p>
            <p>
              <strong>Birth Weight:</strong> {child.birthWeight}
            </p>
            <p>
              <strong>Blood Group:</strong> {child.bloodGroup}
            </p>
          </div>
          <div>
            <p>
              <strong>Vaccination Status:</strong> {child.vaccinationStatus}
            </p>
            <p>
              <strong>Allergies:</strong> {child.allergies || "None"}
            </p>
            <p>
              <strong>Medical Conditions:</strong>{" "}
              {child.medicalConditions || "None"}
            </p>
            <p>
              <strong>Current Medications:</strong>{" "}
              {child.currentMedications || "None"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p>
            <strong>Place of Birth:</strong> {child.placeOfBirth}
          </p>
          <p>
            <strong>Delivery Type:</strong> {child.deliveryType}
          </p>
        </div>

        {/* ✅ Appointment Form for Doctors */}
        {isDoctorPage && (
          <div className="mt-6 border-t border-gray-300 pt-4">
            {!showAppointmentForm ? (
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 border border-black/20 font-semibold"
              >
                Set Appointment
              </button>
            ) : (
              <div className="space-y-3 mt-3">
                <h3 className="font-semibold text-lg">Schedule Appointment</h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Vaccination Type
                  </label>
                  <select
                    value={vaccination}
                    onChange={(e) => setVaccination(e.target.value)}
                    className="border p-2 rounded-md w-full outline-none"
                  >
                    <option value="">Select vaccination</option>
                    <option value="6-in-1">6-in-1 (DTP/Hib/HepB/Polio)</option>
                    <option value="Rotavirus">Rotavirus</option>
                    <option value="MenB">MenB</option>
                    <option value="Pneumococcal (PCV)">
                      Pneumococcal (PCV)
                    </option>
                    <option value="Hib/MenC">Hib/MenC</option>
                    <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                    <option value="4-in-1 Pre-school Booster">
                      4-in-1 Pre-school Booster
                    </option>
                    <option value="Flu Spray">Flu Spray (annual)</option>
                    <option value="HPV">HPV</option>
                    <option value="Other">Other (specify)</option>
                  </select>

                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="border p-2 rounded-md w-full outline-none"
                  />

                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="border p-2 rounded-md w-full outline-none"
                  />
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleSetAppointment}
                    disabled={loading}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 border font-semibold disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Confirm"}
                  </button>

                  <button
                    onClick={() => setShowAppointmentForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 border font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          {isParentPage && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 border border-black/20 font-semibold disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-[#142257] text-white px-6 py-2 rounded hover:bg-[#19358f] border-black/20 border font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
