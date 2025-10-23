import DashboardNav from "@/components/ui/dashboardNav";
import React from "react";

const History = () => {
  return (
    <div>
      <DashboardNav title="history" />
      <div className="border h-[100vh] overflow-scroll">History</div>
    </div>
  );
};

export default History;
