"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const DashboardCardGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8">
      {items.map((item) => (
        <Card
          key={item.title}
          className="h-full hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm sm:text-base font-semibold">
              {item.title}
            </CardTitle>
            <Icon
              icon={item.activeIcon}
              className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
            />
          </CardHeader>
          <CardContent className="pt-2">
            <CardDescription className="mb-1 sm:mb-2 text-xs sm:text-sm">
              {item.description}
            </CardDescription>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-1 sm:space-y-0">
              <Link
                href={item.url}
                className="underline text-sm hover:no-underline text-primary"
              >
                Go to {item.title}
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

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
