import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeToggle from "../ui/theme-toggle";

const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <header className="flex h-16 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Right Section */}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default DashboardHeader;
