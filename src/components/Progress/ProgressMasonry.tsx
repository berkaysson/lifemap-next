"use client";

import { WeeklyActivitiesSummaryChart } from "./WeeklyActivitiesSummaryChart";
import { WeeklyCategoryActivitiesSummaryChart } from "./WeeklyCategoryActivitiesSummaryChart";

const ProgressMasonry = () => {
  return (
    <div className="flex flex-col gap-4 m-2 pt-4">
      <div>
        <WeeklyActivitiesSummaryChart />
      </div>

      <div>
        <WeeklyCategoryActivitiesSummaryChart />
      </div>
    </div>
  );
};

export default ProgressMasonry;
