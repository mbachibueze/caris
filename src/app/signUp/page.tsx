"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const SignUP = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(""); // "parent" or "doctor"

  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sign-up
  const handleSignUP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setMessage("");
    setLoading(true);

    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // Validate match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate role selection
    if (!role) {
      setError("Please select a role (Parent or Doctor).");
      setLoading(false);
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      await signOut(auth);

      setMessage("Verification email sent. Please check your inbox.");
      setSuccess("Account created successfully!");

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        firstName,
        lastName,
        email,
        role,
        createdAt: new Date(),
      });

      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setRole("");

      // Redirect to sign-in
      router.push("/signIn");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error("Firebase error:", err.code);
        if (err.code === "auth/email-already-in-use") {
          setError("An account with this email already exists.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak. Please use at least 8 characters.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#1739b6] h-screen w-screen grid place-items-center">
      <div className="bg-white rounded-2xl p-5 w-80 md:w-96">
        <fieldset id="sign_up">
          <legend className="font-bold text-2xl uppercase text-[#1739b6] text-center mb-5">
            Caris+
          </legend>

          <form onSubmit={handleSignUP}>
            {/* Input fields */}
            <div className="flex flex-col gap-2 mb-3 [&_input]:w-full">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2"
              />
            </div>

            {/* Role buttons */}
            <div className="flex justify-between gap-2 mb-3">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`shadow p-2 w-full rounded cursor-pointer ${
                  role === "parent"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`shadow p-2 w-full rounded cursor-pointer ${
                  role === "doctor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Doctor
              </button>
            </div>

            {/* Submit button */}
            <div className="flex flex-col gap-3 text-center mt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1739b6] mx-auto text-white font-medium p-2 px-8 rounded md:w-fit w-full disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            {/* Feedback messages */}
            {error && (
              <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 mt-2 text-xs text-center">
                {success}
              </p>
            )}
            {message && (
              <p className="text-blue-500 mt-2 text-xs text-center">
                {message}
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
