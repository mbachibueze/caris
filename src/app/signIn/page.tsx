"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
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
  const [rememberMe, setRememberMe] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  // ✅ Load last used email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Autofocus email input
    emailRef.current?.focus();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // ✅ Save or remove email based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Check email verification
      if (!user.emailVerified) {
        await signOut(auth);
        setMessage("Please verify your email before signing in.");
        setLoading(false);
        return;
      }

      // Fetch user role
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User record not found in database.");
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const userRole = userData.role;

      // Store info locally
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userRole", userRole || "");
      localStorage.setItem("justLoggedIn", "true");

      // Redirect
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

        switch (firebaseError.code) {
          case "auth/user-not-found":
            setError("No account found with this email. Please sign up.");
            break;
          case "auth/wrong-password":
            setError("Incorrect password. Please try again.");
            break;
          case "auth/invalid-email":
            setError("Invalid email address. Please check your input.");
            break;
          case "auth/too-many-requests":
            setError("Too many failed attempts. Please try again later.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#1739b6] h-screen w-screen grid place-items-center relative">
      <Link
        href="/"
        className="absolute text-sm text-gray-200 underline cursor-pointer top-0 left-0 p-2"
      >
        <div>Back to Home</div>
      </Link>
      <div className="bg-white rounded-2xl p-5 w-100 h-100 [&_input] ">
        <fieldset id="sign_in">
          <legend className="font-bold text-2xl uppercase text-[#1739b6] text-center mb-5">
            Caris+
          </legend>

          <form onSubmit={handleSignIn}>
            <div className="flex gap-2 mb-3 justify-between">
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2 w-full"
              />
            </div>

            <div className="flex gap-2 mb-3 justify-between">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-300 outline-none border border-amber-300 rounded px-3  p-2 w-full"
              />
            </div>

            {/* ✅ Remember Me */}
            <div className="flex w-fit mx-auto mb-3">
              <div className="flex items-center gap-3  w-full relative">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="cursor-pointer w-fit border border-red-600 "
                />
                <p className="text-sm border flex text-gray-700 cursor-pointer ablsolute ">
                  Remember Me
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-center mt-10">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1739b6] mx-auto text-white font-medium p-2 px-12 rounded md:w-fit w-full disabled:opacity-50 cursor-pointer"
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
          {/* eslint-disable-next-line react/no-unescaped-entities */}
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
