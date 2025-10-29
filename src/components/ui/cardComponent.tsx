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

interface ChildCardProps {
  child: {
    id: string;
    childName: string;
    dateOfBirth: string;
    gender: string;
    photoURL?: string;
    vaccinationStatus: string;
    bloodGroup: string;
  };
  onViewMore: () => void;
}

export function Child({ child, onViewMore }: ChildCardProps) {
  return (
    <div className="bg-white rounded-lg w-full flex flex-col shadow-md p-4 hover:shadow-lg transition cursor-pointer">
      <div className="flex items-center gap-4 [&_p]:text-sm">
        <div className="flex flex-col gap-5">
          <h3 className="font-semibold text-lg mb-5">{child.childName}</h3>
          <div className="[&_p]:text-gray-600 ">
            <p>Gender: {child.gender}</p>
            <p>Blood group: {child.bloodGroup} </p>
            <p>DOB: {child.dateOfBirth}</p>
          </div>
          <p className=" text-blue-600 font-medium">
            Status: {child.vaccinationStatus}
          </p>
        </div>
      </div>

      <button
        onClick={onViewMore}
        className="border mt-3 ml-auto w-fit text-blue-600 cursor-pointer text-sm font-semibold px-2 rounded-full glass3"
      >
        View More →
      </button>
    </div>
  );
}
