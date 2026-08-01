"use client";

import { WeeklyActivitiesSummaryChart } from "./WeeklyActivitiesSummaryChart";
import { WeeklyActivitiesSummaryRadialChart } from "./WeeklyActivitiesSummaryRadialChart";
import { WeeklyCategoryActivitiesSummaryChart } from "./WeeklyCategoryActivitiesSummaryChart";

const ProgressMasonry = () => {
  return (
    <div className="flex flex-col gap-4 m-2 pt-4">
      <div>
        <WeeklyActivitiesSummaryRadialChart />
      </div>
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
