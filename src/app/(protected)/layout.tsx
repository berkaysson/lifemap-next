"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/layouts/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  console.log(
    "🚀 ~ file: layout.tsx:26 ~ ProtectedLayout ~ pathname:",
    pathname
  );

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
