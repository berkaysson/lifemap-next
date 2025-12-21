import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import RecentTodos from "@/components/Dashboard/RecentTodos";
import RecentTasks from "@/components/Dashboard/RecentTasks";
import RecentHabits from "@/components/Dashboard/RecentHabits";
import DailyItemsCarousel from "@/components/Dashboard/DailyItemsCaraousel";
import QuickActions from "@/components/Dashboard/QuickActions";
import { Separator } from "@/components/ui/separator";
import { DashboardCardGrid } from "@/components/Dashboard/DashboardCardGrid";
import { WelcomeHeader } from "@/components/Dashboard/WelcomeHeader";
import { WeeklyActivitiesSummaryRadialChart } from "@/components/Progress/WeeklyActivitiesSummaryRadialChart";

const DashboardPage = () => {
  return (
    <div>
      <DashboardHeader title="Dashboard" />

      <div className="p2-4 sm:py-6 px-2 sm:px-3">
        {/* Summary Section */}
        <WelcomeHeader />

        <div className="mt-2">
          <WeeklyActivitiesSummaryRadialChart />
        </div>

        <div className="my-6 sm:my-8">
          <DailyItemsCarousel />
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="my-4 sm:my-6">
          <QuickActions />

          <DashboardCardGrid />
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
      </div>
    </div>
  );
};

export default DashboardPage;
