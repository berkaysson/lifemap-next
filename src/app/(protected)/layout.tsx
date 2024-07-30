"use client";

import { ActivityProvider } from "@/contexts/ActivityContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { TodoProvider } from "@/contexts/TodoContext";
import Link from "next/link";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TodoProvider>
      <CategoryProvider>
        <ActivityProvider>
          <TaskProvider>
            <nav className="flex gap-4 p-4 border-b">
              <Link
                href="/dashboard"
                className="font-bold text-lg hover:underline"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="font-bold text-lg hover:underline"
              >
                Settings
              </Link>
            </nav>
            {children}
          </TaskProvider>
        </ActivityProvider>
      </CategoryProvider>
    </TodoProvider>
  );
};

export default ProtectedLayout;
