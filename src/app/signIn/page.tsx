"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const SignIN = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setMessage("");

    try {
      // Attempt sign-in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        setMessage("Please verify your email before signing in.");
        setLoading(false);
        return;
      }

      // Fetch the user's role from Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User record not found in database.");
        setLoading(false);
        return;
      }

      // Extract role from the Firestore document
      const userData = querySnapshot.docs[0].data();
      const userRole = userData.role;

      // Store user info locally
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userRole", userRole || "");
      localStorage.setItem("justLoggedIn", "true");

      // Redirect based on role
      if (userRole === "parent") {
        router.push(`/parent/dashboard/${user.uid}`);
      } else if (userRole === "doctor") {
        router.push(`/doctor/dashboard/${user.uid}`);
      } else {
        setError("No account found with this email. Please sign up.");
      }

      setMessage("Logged in successfully!");
    } catch (err: unknown) {
      console.error("Error logging in:", err);

      if (typeof err === "object" && err !== null && "code" in err) {
        const firebaseError = err as { code: string; message?: string };

        if (firebaseError.code === "auth/user-not-found") {
          setError("No account found with this email. Please sign up.");
        } else if (firebaseError.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (firebaseError.code === "auth/invalid-email") {
          setError("Invalid email address. Please check your input.");
        } else if (firebaseError.code === "auth/too-many-requests") {
          setError("Too many failed attempts. Please try again later.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        // Fallback for unexpected error structures
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


     /* eslint-disable react/no-unescaped-entities */
  return (
    <main className="bg-[#1739b6] h-screen w-screen grid place-items-center relative">
      <Link
        href="/"
        className="absolute text-sm text-gray-200 underline cursor-pointer top-0 left-0 p-2"
      >
        <div>Back to Home</div>
      </Link>
      <div className="bg-white rounded-2xl p-5 w-70 [&_input]:w-full ">
        <fieldset id="sign_in">
          <legend className="font-bold text-2xl uppercase text-[#1739b6] text-center mb-5">
            Caris+
          </legend>

          <form onSubmit={handleSignIn}>
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

            <div className="flex flex-col gap-3 text-center mt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1739b6] mx-auto text-white font-medium p-2 px-8 rounded md:w-fit w-full disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {error && (
              <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
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
          Don't have an account?{" "}
          <Link href="/signUp" className="text-blue-700 cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignIN;
