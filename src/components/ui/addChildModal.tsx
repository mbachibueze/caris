"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";

const AddChildModal = ({ onClose }: { onClose: () => void }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [childData, setChildData] = useState({
    childName: "",
    dateOfBirth: "",
    gender: "",
    birthWeight: "",
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",
    vaccinationStatus: "",
    currentMedications: "",
    placeOfBirth: "",
    deliveryType: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Make sure userId is set before writing data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be signed in to add a child.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get parent document from Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      // 🔹 Step 2: Construct parentName if found
      let parentName = "Unknown Parent";

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const first = userData.firstname || userData.firstName || "";
        const last = userData.lastname || userData.lastName || "";
        parentName = `${first} ${last}`.trim();
      });

      const childId = uuidv4();

      const childDocData = {
        ...childData,
        // photoURL: photoURL || "",
        parentUid: userId,
        parentName,
        createdAt: serverTimestamp(),
      };

      // ✅ Write to global children collection
      await setDoc(doc(db, "children", childId), childDocData);

      // // ✅ Write to user's subcollection (same ID)
      // await setDoc(doc(db, "users", userId, "children", childId), childDocData);

      console.log("✅ Successfully written to:");
      console.log(`children/${childId}`);
      console.log(`users/${userId}/children/${childId}`);

      onClose();
    } catch (error) {
      console.error("🔥 Error adding child:", error);
      alert("Failed to add child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="glass2  custom-scrollbar w-[90%] max-w-lg rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
          aria-label="Close modal"
        >
          <IoMdClose />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add Child Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="childName"
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            className="input"
            required
          />
          <select
            name="gender"
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="text"
            name="birthWeight"
            placeholder="Birth Weight (kg)"
            onChange={handleChange}
            className="input"
            required
          />
          <select
            required
            name="bloodGroup"
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Blood Group</option>
            <option>O+</option>
            <option>A+</option>
            <option>B+</option>
            <option>AB+</option>
          </select>

          <textarea
            name="allergies"
            placeholder="Allergies"
            onChange={handleChange}
            className="input"
          />
          <textarea
            name="medicalConditions"
            placeholder="Medical Conditions"
            onChange={handleChange}
            className="input"
          />
          <select
            name="vaccinationStatus"
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Vaccination Status</option>
            <option>Not started</option>
            <option>Incomplete</option>
            <option>Up to date</option>
          </select>

          <textarea
            name="currentMedications"
            placeholder="Current Medications"
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="placeOfBirth"
            placeholder="Place of Birth"
            onChange={handleChange}
            className="input"
            required
          />
          <select
            required
            name="deliveryType"
            onChange={handleChange}
            className="input"
          >
            <option value="">Delivery Type</option>
            <option>Normal</option>
            <option>Caesarean Section</option>
            <option>Home Delivery</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Add Child"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
