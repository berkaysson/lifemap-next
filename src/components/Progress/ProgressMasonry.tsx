"use client";

import { WeeklyActivitiesSummaryChart } from "./WeeklyActivitiesSummaryChart";
import { WeeklyActivitiesSummaryRadialChart } from "./WeeklyActivitiesSummaryRadialChart";
import { WeeklyCategoryActivitiesSummaryChart } from "./WeeklyCategoryActivitiesSummaryChart";
import { MonthlyReportContainer } from "./Monthly/MonthlyReportContainer";
import { Separator } from "@/components/ui/separator";

const ProgressMasonry = () => {
  return (
    <div className="flex flex-col gap-4 m-2 pt-4">
      {/* ── Existing Weekly Charts ── */}
      <div>
        <WeeklyActivitiesSummaryRadialChart />
      </div>
      <div>
        <WeeklyActivitiesSummaryChart />
      </div>
      <div>
        <WeeklyCategoryActivitiesSummaryChart />
      </div>

      {/* ── Monthly Report Section ── */}
      <Separator className="my-4" />

      <div>
        <h2 className="text-lg font-semibold mb-4 px-1">Monthly Report</h2>
        <MonthlyReportContainer />
      </div>
    </div>
  );
};

export default ProgressMasonry;
