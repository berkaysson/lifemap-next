import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import Loading from "./loading";
import { Suspense } from "react";


const ProgressPage = () => {
  return (
    <div>
      <DashboardHeader title="Project" />

      <Suspense fallback={<Loading />}>
        Progress page
      </Suspense>
    </div>
  );
};

export default ProgressPage;
