"use client";

import ActivityForm from "@/components/Activities/ActivityForm";
import { DashboardContent } from "@/components/Dashboard/dashboard-content";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardContent>{children}</DashboardContent>

      <ActivityForm />
    </div>
  );
};

export default DashboardLayout;
