"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export const DashboardCardGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-center group"
        >
          <Icon
            icon={item.activeIcon}
            className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary group-hover:text-primary-foreground"
          />
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

const items = [
  {
    title: "Activities",
    url: "/dashboard/activity",
    activeIcon: "solar:bolt-bold-duotone",
  },
  {
    title: "Categories",
    url: "/dashboard/category",
    activeIcon: "solar:hashtag-square-bold-duotone",
  },
  {
    title: "ToDos",
    url: "/dashboard/todo",
    activeIcon: "solar:checklist-minimalistic-bold-duotone",
  },
  {
    title: "Tasks",
    url: "/dashboard/task",
    activeIcon: "solar:check-read-bold-duotone",
  },
  {
    title: "Habits",
    url: "/dashboard/habit",
    activeIcon: "ph:plant-duotone",
  },
  {
    title: "Projects",
    url: "/dashboard/project",
    activeIcon: "solar:folder-with-files-bold-duotone",
  },
];
