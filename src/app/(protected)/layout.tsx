"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/layouts/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const queryClient = new QueryClient();

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
