 
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SignIN = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data(); // ✅ extract the actual user data

        // 🔍 Alert the fetched user details for confirmation
        alert(`User ID: ${userId}\nEmail: ${userData.email}\nPassword: ${userData.password}`);

        // ✅ Optional: console log entire object for inspection
        console.log("Fetched user data:", userData);

        // ✅ Now redirect properly using a template literal
        router.push(`/parent/dashboard/${userId}`);

        // ✅ Optional: friendly welcome message
        alert(`Welcome ${userData.firstName || 'User'}!`);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react/no-unescaped-entities */
  return (
    <main className='bg-[#1739b6] h-screen w-screen grid place-items-center relative'>
      <Link href='/' className='absolute text-sm text-gray-200 underline cursor-pointer top-0 left-0 p-2'>
        <div className=''>
          Back to Home
        </div>
      </Link>
      <div className='bg-white rounded-2xl p-5 w-fit'>
        <fieldset id='sign_in'>
          <legend className='font-bold text-2xl uppercase text-[#1739b6] text-center mb-5'>Caris+</legend>

          <form onSubmit={handleSignIn}>
            <div className='flex gap-2 mb-3 justify-between'>
              <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2'
              />
            </div>

            <div className='flex gap-2 mb-3 justify-between'>
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-gray-300 outline-none border border-gray-300 rounded px-3 p-2'
              />
            </div>

            <div className='flex items-center text-sm mx-auto w-fit mb-3 '>
              <label><input type="checkbox" /> Remember me </label>
            </div>

            <div className='flex flex-col gap-3 text-center mt-3'>
              <button
                type="submit"
                disabled={loading}
                className='bg-[#1739b6] mx-auto text-white font-medium p-2 px-8 rounded md:w-fit w-full disabled:opacity-50 cursor-pointer'
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {error && <p className='text-red-500 mt-2 text-center'>{error}</p>}
          </form>
        </fieldset>

        <p className='text-xs text-center text-gray-500 underline mt-5 cursor-pointer'>Forgot Password?</p>
        <p className='text-xs text-center text-gray-500 mt-2'>
          Don't have an account?{' '}
          <Link href='/signUp' className='text-blue-700 cursor-pointer'>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignIN;
