import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../../layouts/sidebar/sidebar";
import ThemeToggle from "@/components/ui/Buttons/theme-toggle";
import { memo, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { Iconify } from "@/components/ui/iconify";

const DashboardHeader = ({
  title,
  DialogComponent,
}: {
  title: string;
  DialogComponent?: React.ReactNode;
}) => {
  return (
    <header className="flex h-16 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <h2 className="text-lg font-semibold text-fore">{title}</h2>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        {DialogComponent && (
          <Suspense fallback={<Skeleton className="h-9 w-9" />}>
            {DialogComponent}
          </Suspense>
        )}
        <Separator orientation="vertical" className="h-6" />
        <Link href="/dashboard" aria-label="Go to dashboard">
          <IconButton>
            <Iconify icon="solar:home-2-bold" />
          </IconButton>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default memo(DashboardHeader);
