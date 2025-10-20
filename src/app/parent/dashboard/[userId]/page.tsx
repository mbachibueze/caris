'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

// ✅ Define a clear type for your Firestore user
interface UserData {
  email: string;
  createdAt: number; // or string if stored as ISO text
}

const ParentDashboard = () => {
  const { userId } = useParams();
  
  // ✅ Replace `any` with your defined type
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', userId as string);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // ✅ Cast Firestore data to UserData type
          setUser(userSnap.data() as UserData);
        } else {
          console.error('No user found!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <main className="min-h-screen bg-[#f4f6ff] w-[95%] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1739b6]">Welcome</h1>
        <Link href="/signIn" className="bg-blue-700 text-white p-2 px-6 rounded-lg">
          Log out
        </Link>
      </div>

      {user ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-fit mt-6">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No user data found.</p>
      )}
    </main>
  );
};

export default ParentDashboard;
