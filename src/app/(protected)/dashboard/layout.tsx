"use client";

import ActivityForm from "@/components/Activities/ActivityForm";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav className="flex gap-2 p-4 border-b pl-6">
        <Link
          href="/dashboard/activity"
          className="font-bold text-md hover:underline"
        >
          Activities
        </Link>
        <Link
          href="/dashboard/todo"
          className="font-bold text-md hover:underline"
        >
          ToDos
        </Link>
        <Link
          href="/dashboard/task"
          className="font-bold text-md hover:underline"
        >
          Tasks
        </Link>
        <Link
          href="/dashboard/habit"
          className="font-bold text-md hover:underline"
        >
          Habits
        </Link>
        <Link
          href="/dashboard/project"
          className="font-bold text-md hover:underline"
        >
          Projects
        </Link>
        <Link
          href="/dashboard/category"
          className="font-bold text-md hover:underline"
        >
          Categories
        </Link>
      </nav>
      {children}
      <ActivityForm />
    </div>
  );
};

export default DashboardLayout;
