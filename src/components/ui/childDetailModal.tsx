"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";

interface ChildDetails {
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
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isParentPage = pathname.includes("/parent");
  const isDoctorPage = pathname.includes("/doctor");


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

    const handleDelete = async () => {
    if (!userId || !child.id) {
      alert("Missing user or child ID.");
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${child.childName}'s record?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      // Delete from global collection
      await deleteDoc(doc(db, "children", child.id));
      // Delete from user's subcollection
      await deleteDoc(doc(db, "users", userId, "children", child.id));

      alert(`${child.childName}'s record deleted successfully.`);
      onClose();
    } catch (error) {
      console.error("🔥 Error deleting child:", error);
      alert("Failed to delete record. Please try again.");
    } finally {
      setLoading(false);
    }
  };


    /* eslint-disable react/no-unescaped-entities */
  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
      <div className="glass w-[90%] max-w-lg rounded-lg p-6 overflow-y-auto max-h-[90vh] shadow-lg">
        <div className="flex flex-col justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {child.childName}'s Details
          </h2>
          {isDoctorPage && (
            <p className="text-sm italic">{child.parentName}</p>
          ) }
        </div>

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
