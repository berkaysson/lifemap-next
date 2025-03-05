import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import { Button } from "@/components/ui/Buttons/button";
import RecentTodos from "@/components/Dashboard/RecentTodos";
import RecentTasks from "@/components/Dashboard/RecentTasks";
import RecentHabits from "@/components/Dashboard/RecentHabits";
import DailyItemsCarousel from "@/components/Dashboard/DailyItemsCaraousel";
import QuickActions from "@/components/Dashboard/QuickActions";

const items = [
  {
    title: "Activities",
    url: "/dashboard/activity",
    icon: "solar:bolt-bold",
    activeIcon: "solar:bolt-bold-duotone",
    description: "Track and manage your daily activities",
    count: 12,
  },
  {
    title: "Activity Types",
    url: "/dashboard/category",
    icon: "solar:hashtag-square-bold",
    activeIcon: "solar:hashtag-square-bold-duotone",
    description: "Organize your activities into Activity Types",
    count: 8,
  },
  {
    title: "ToDos",
    url: "/dashboard/todo",
    icon: "solar:checklist-minimalistic-bold",
    activeIcon: "solar:checklist-minimalistic-bold-duotone",
    description: "Manage your to-do lists",
    count: 5,
  },
  {
    title: "Tasks",
    url: "/dashboard/task",
    icon: "solar:check-read-bold",
    activeIcon: "solar:check-read-bold-duotone",
    description: "Organize and track your ongoing tasks",
    count: 3,
  },
  {
    title: "Habits",
    url: "/dashboard/habit",
    icon: "ph:plant-bold",
    activeIcon: "ph:plant-duotone",
    description: "Build and maintain positive habits",
    count: 7,
  },
  {
    title: "Projects",
    url: "/dashboard/project",
    icon: "solar:folder-with-files-bold",
    activeIcon: "solar:folder-with-files-bold-duotone",
    description: "Manage and track your ongoing tasks, to-dos, and habits",
    count: 4,
  },
];

const DashboardPage = () => {
  return (
    <div>
      <DashboardHeader title="Dashboard" />

      <div className="py-4 sm:py-6 px-2 sm:px-3">
        {/* Summary Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-6 mb-6 sm:mb-8 text-white text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
            Welcome back, User!
          </h2>
          {/* <p className="text-sm sm:text-base mb-2">
            You have 3 tasks due today and 2 habits to maintain.
          </p> */}
          {/* <Button variant="secondary" className="mt-2 w-full sm:w-auto">
            View Summary
          </Button> */}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        <div className="mb-6 sm:mb-8">
          <DailyItemsCarousel />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card
              key={item.title}
              className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  {item.title}
                </CardTitle>
                <Icon
                  icon={item.activeIcon}
                  className="h-5 w-5 sm:h-6 sm:w-6 text-themeAlt"
                />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3 sm:mb-4">
                  {item.description}
                </CardDescription>
                <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0">
                  {/* <span className="text-xs sm:text-sm font-medium text-gray-500">
                    {item.count} items
                  </span> */}
                  <Button
                    asChild
                    size="sm"
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    <Link href={item.url}>Go to {item.title}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-3 sm:mt-6 flex flex-col gap-6">
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
