import ActivityList from "@/components/Activities/ActivityList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import Loading from "./loading";
import { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <DashboardHeader title="Activity" />
      <Suspense fallback={<Loading />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default Page;
