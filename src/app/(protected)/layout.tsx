"use client";

import { ActivityProvider } from "@/contexts/ActivityContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
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
      </ProjectProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
