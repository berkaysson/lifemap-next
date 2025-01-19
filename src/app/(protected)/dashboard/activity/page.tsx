"use client";

import ActivityList from "@/components/Activities/ActivityList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";


const Page = () => {
  return (
    <div>
      <DashboardHeader title="Activity" />
      <ActivityList />
    </div>
  );
};

export default Page;
