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
    <div className="min-h-screen flex fixed w-screen">
      {/* Sidebar */}
      <ParentSidebar userId={userId as string} />

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-2 bg-gray-200">
        <div className="p-2 flex flex-col gap-2">
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
