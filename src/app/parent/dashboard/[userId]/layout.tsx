"use client";

import React from "react";
import { useParams } from "next/navigation";
import ParentSidebar from "./sideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useParams();

  return (
    <div className="min-h-screen flex w-full box-border">
      {/* Sidebar container */}
      <div className="relative z-50 md:block hidden">
        <ParentSidebar userId={userId as string} />
      </div>

      {/* Scrollable main area */}
      <main className="flex-1 flex flex-col gap-2 bg-gray-200 overflow-auto box-border custom-scrollbar h-screen">
        <div className="p-2 pt-0 flex flex-col gap-2">{children}</div>
      </main>
    </div>
  );
}
