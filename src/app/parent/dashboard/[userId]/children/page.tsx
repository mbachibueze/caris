"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Child } from "@/components/ui/cardComponent";
import AddChildModal from "@/components/ui/addChildModal";
import ChildDetailsModal from "@/components/ui/childDetailModal";
import DashboardNav from "@/components/ui/dashboardNav";
import { AnimatePresence } from "framer-motion";
import { ChildData } from "@/types/child";




const Children = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const childrenRef = collection(db, "children");
    const q = query(childrenRef, where("parentUid", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const childrenList: ChildData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChildData, "id">), // ✅ Type-safe casting
      }));
      setChildren(childrenList);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <DashboardNav title="My Children" />
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="font-medium text-white bg-[#327cff] p-2 px-6 rounded cursor-pointer sm:w-fit"
        >
          Add Child
        </button>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
          <AnimatePresence>
            {children.map((child) => (
              <Child
                key={child.id}
                child={child}
                onViewMore={() => setSelectedChild(child)}
              />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedChild && (
            <ChildDetailsModal
              child={selectedChild}
              onClose={() => setSelectedChild(null)}
            />
          )}
          {showAddModal && (
            <AddChildModal onClose={() => setShowAddModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Children;
