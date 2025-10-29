"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardNav from "@/components/ui/dashboardNav";
import { Child } from "@/components/ui/cardComponent";
import ChildDetailsModal from "@/components/ui/childDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import { ChildData } from "@/types/child";




const Children = () => {
  const [children, setChildren] = useState<ChildData[]>([]); 
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);

  useEffect(() => {
    const childrenRef = collection(db, "children");

    const unsubscribe = onSnapshot(childrenRef, (snapshot) => {
      const allChildren: ChildData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChildData, "id">), // safely cast doc.data() to ChildData shape
      }));
      setChildren(allChildren);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <DashboardNav title="Children" />

      <div className="flex flex-col gap-2 p-2 ">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
          <AnimatePresence>
            {children.map((child) => (
              <motion.div
                key={child.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Child
                  child={child}
                  onViewMore={() => setSelectedChild(child)}
                />
              </motion.div>
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Children;
