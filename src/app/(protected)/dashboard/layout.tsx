import ActivityForm from "@/components/Activities/ActivityForm";
import { CreateAnythingMenu } from "@/components/CreateMenu/CreateAnythingMenu";
import { DashboardContent } from "@/layouts/sidebar/dashboard-content";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardContent>{children}</DashboardContent>

      <CreateAnythingMenu />
      <ActivityForm />
    </div>
  );
};

export default DashboardLayout;
