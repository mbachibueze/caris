"use client";

import Link from "next/link";
import React, { useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SignUP = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Step 1: Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Step 2: Check if user already exists
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("User already exists");
        setLoading(false);
        return;
      }

      // Step 3: Create new user
      await addDoc(collection(db, "users"), {
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      setSuccess("Account created successfully!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#1739b6] h-screen w-screen grid place-items-center">
      <div className="bg-white rounded-2xl p-5 w-fit">
        <fieldset id="sign_up">
          <legend className="font-bold text-2xl uppercase text-[#1739b6] text-center mb-5">
            Caris+
          </legend>

          <form onSubmit={handleSignUP}>
            <div className="flex gap-2 mb-3 justify-between">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
            </div>

            <div className="flex gap-2 mb-3 justify-between">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
            </div>

            <div className="flex gap-2 mb-3 justify-between">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
            </div>

            <div className="flex items-center text-sm mx-auto w-fit mb-3">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <div className="flex flex-col gap-3 text-center mt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1739b6] mx-auto text-white font-medium p-2 px-8 rounded md:w-fit w-full disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            {error && (
              <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 mt-2 text-xs text-center">
                {success}
              </p>
            )}
          </form>
        </fieldset>

        <p className="text-xs text-center text-gray-500 underline mt-5 cursor-pointer">
          Forgot Password?
        </p>
        <p className="text-xs text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <Link href="/signIn" className="text-blue-700 cursor-pointer">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUP;
