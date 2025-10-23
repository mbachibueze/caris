/** @format */

import React from "react";
import { LucideIcon } from "lucide-react";

interface CardProps {
  label: string;
  icon: LucideIcon;
  amount: string;
  description: string;
}

export default function Card({
  label,
  icon: Icon,
  amount,
  description,
}: CardProps) {
  return (
    <main className="flex w-full bg-white flex-col justify-between gap-4 rounded-xl p-5 shadow border border-white">
      <section className="flex justify-between gap-2">
        {/* Label */}
        <p className="text-sm">{label}</p>

        {/* Icon */}
        <Icon className="h-4 w-4 text-gray-400" />
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">{amount}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </section>
    </main>
  );
}
