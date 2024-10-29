"use client";

import { ActivityProvider } from "@/contexts/ActivityContext";
import { HabitProvider } from "@/contexts/HabitContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { TaskProvider } from "@/contexts/TaskContext";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TaskProvider>
          <HabitProvider>
            <ActivityProvider>
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
            </ActivityProvider>
          </HabitProvider>
        </TaskProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
