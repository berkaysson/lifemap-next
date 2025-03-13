"use client";

import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import RecentTodos from "@/components/Dashboard/RecentTodos";
import RecentTasks from "@/components/Dashboard/RecentTasks";
import RecentHabits from "@/components/Dashboard/RecentHabits";
import DailyItemsCarousel from "@/components/Dashboard/DailyItemsCaraousel";
import QuickActions from "@/components/Dashboard/QuickActions";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { DashboardCardGrid } from "@/components/Dashboard/DashboardCardGrid";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <div>
      <DashboardHeader title="Dashboard" />

      <div className="py-4 sm:py-6 px-2 sm:px-3">
        {/* Summary Section */}
        <div className="bg-gradient-to-r from-secondary to-white rounded-lg shadow-lg p-6 mb-6 sm:mb-8 text-black text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
            Welcome back, {session?.user?.name || "User"}
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="my-6 sm:my-8">
          <QuickActions />
        </div>

        <Separator />

        <div className="my-6 sm:my-8">
          <DailyItemsCarousel />
        </div>

        <Separator />

        <div className="my-6 sm:my-8 flex flex-col gap-6">
          {/* Recent Habits */}
          <RecentHabits />

          {/* Recent Tasks */}
          <RecentTasks />

          {/* Recent Todos */}
          <RecentTodos />
        </div>

        <Separator />

        {/* Card Item Grid */}
        <div className="my-6 sm:my-8">
          <DashboardCardGrid />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
