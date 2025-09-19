"use client";

import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import Loading from "./loading";
import { Suspense } from "react";
import ProgressMasonry from "@/components/Progress/ProgressMasonry";

const ProgressPage = () => {
  return (
    <div>
      <DashboardHeader title="Your Progress" />

      <Suspense fallback={<Loading />}>
        <ProgressMasonry />
      </Suspense>
    </div>
  );
};

export default ProgressPage;
