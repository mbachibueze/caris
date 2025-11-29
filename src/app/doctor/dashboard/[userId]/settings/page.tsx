"use client";

import DashboardNav from "@/components/ui/dashboardNav";
import React from "react";

import { Resend } from "resend";

const Settings = () => {
  const resend = new Resend("re_fdtPoAwk_HU3XzPYnyUBeG5XKLyQcMcAD");

  const sendEmail = () => {
    try {
      resend.emails.send({
        from: "CareTrack",
        to: "mbachibueze27@gmail.com",
        subject: "New Vaccination Appointment Scheduled",
        html: "<p>Your child has a new vaccination appointment scheduled. Please log in to your account to view the details.</p>",
      });

      alert("Send Email button clicked!");
    } catch (error) {
      alert("Error sending email. Check console for details.");
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
      <DashboardNav title="Settings" />
      <div>
        <button
          onClick={sendEmail}
          className="bg-blue-600 text-white p-2 px-6 rounded cursor-pointer"
        >
          Send E-mail
        </button>
      </div>
    </div>
  );
};

export default Settings;
