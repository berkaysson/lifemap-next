"use client";

import { WeeklyActivitiesSummaryChart } from "./WeeklyActivitiesSummaryChart";

const ProgressMasonry = () => {
  return (
    <div className="flex flex-col gap-4 m-2 pt-4">
      <div>
        <WeeklyActivitiesSummaryChart />
      </div>
    </div>
  );
};

export default ProgressMasonry;
