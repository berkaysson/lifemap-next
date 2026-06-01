"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_STRATEGIES } from "@/queries/queryConfig";
import { AppSidebar } from "@/layouts/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/layouts/sidebar/sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...CACHE_STRATEGIES.REGULAR,
    },
  },
});

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
