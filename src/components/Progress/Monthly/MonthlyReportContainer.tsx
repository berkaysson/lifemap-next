"use client";

import { useState, useMemo } from "react";
import { format, addMonths, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Buttons/button";
import { useSession } from "next-auth/react";
import { useFetchMonthlyReport } from "@/queries/progressQueries";
import { MonthlyKPIBanner } from "./MonthlyKPIBanner";
import { DailyActivityHeatmap } from "./DailyActivityHeatmap";
import { MonthlyHabitRadialChart } from "./MonthlyHabitRadialChart";
import { TaskProgressChart } from "./TaskProgressChart";
import { TodoTimelineChart } from "./TodoTimelineChart";
import { WeeklyActivitiesSummaryChart } from "../WeeklyActivitiesSummaryChart";

export function MonthlyReportContainer() {
  const { data: session } = useSession();

  // Current month offset (0 = current month, -1 = last month, etc.)
  const [offset, setOffset] = useState(0);

  const targetDate = useMemo(
    () => startOfMonth(addMonths(new Date(), offset)),
    [offset],
  );

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1; // 1-indexed

  const { data, isLoading, isError } = useFetchMonthlyReport(year, month);

  // Minimum offset: capped to account creation month
  const minOffset = useMemo(() => {
    const iso = (session?.user as any)?.emailVerified as string | undefined;
    if (!iso) return -60;
    const verifiedMonth = startOfMonth(new Date(iso));
    let current = 0;
    while (true) {
      const candidate = startOfMonth(addMonths(new Date(), current - 1));
      if (candidate >= verifiedMonth) {
        current -= 1;
      } else {
        break;
      }
    }
    return current;
  }, [session]);

  const isAtMin = offset <= minOffset;
  const isAtMax = offset >= 0;

  // Map offset to the week-based month offset that WeeklyActivitiesSummaryChart uses
  // The weekly chart uses the same monthOffset convention
  const weeklyChartOffset = offset;

  return (
    <div className="flex flex-col gap-6">
      {/* Month Navigator */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isAtMin}
          onClick={() => setOffset((prev) => prev - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[140px] text-center text-sm font-semibold tracking-wide">
          {format(targetDate, "MMMM yyyy")}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isAtMax}
          onClick={() => setOffset((prev) => prev + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Section 1 — KPI Banner */}
      <MonthlyKPIBanner data={data} isLoading={isLoading} isError={isError} />

      {/* Section 2A — Daily Heatmap */}
      <DailyActivityHeatmap
        year={year}
        month={month}
        dailyActivity={data?.dailyActivity ?? []}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Section 2B — Weekly Activity Chart (reuse existing, locked to this month) */}
      <WeeklyActivitiesSummaryChart lockedMonthOffset={weeklyChartOffset} />

      {/* Section 3 — Habit Radial Chart */}
      <MonthlyHabitRadialChart
        habitStats={data?.habitStats ?? []}
        isLoading={isLoading}
        isError={isError}
        month={format(targetDate, "MMMM yyyy")}
      />

      {/* Section 4A — Task Progress */}
      <TaskProgressChart
        taskStats={data?.taskStats ?? []}
        isLoading={isLoading}
        isError={isError}
        month={format(targetDate, "MMMM yyyy")}
      />

      {/* Section 4B — Todo Timeline */}
      <TodoTimelineChart
        todoTimeline={data?.todoTimeline ?? []}
        year={year}
        month={month}
        isLoading={isLoading}
        isError={isError}
        monthLabel={format(targetDate, "MMMM yyyy")}
      />
    </div>
  );
}
