"use client";

import { useMemo } from "react";
import {
  getDaysInMonth,
  format,
  getDay,
} from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyActivityEntry } from "@/services/progress/getMonthlyReport";

type Props = {
  year: number;
  month: number; // 1-indexed
  dailyActivity: DailyActivityEntry[];
  isLoading: boolean;
  isError: boolean;
};

const INTENSITY_CLASSES = [
  "bg-muted/40",
  "bg-violet-500/20",
  "bg-violet-500/40",
  "bg-violet-500/60",
  "bg-violet-500/80",
  "bg-violet-500",
];

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getIntensityLevel(minutes: number, max: number): number {
  if (minutes === 0 || max === 0) return 0;
  const ratio = minutes / max;
  if (ratio < 0.15) return 1;
  if (ratio < 0.35) return 2;
  if (ratio < 0.55) return 3;
  if (ratio < 0.8) return 4;
  return 5;
}

export function DailyActivityHeatmap({
  year,
  month,
  dailyActivity,
  isLoading,
  isError,
}: Props) {
  const { cells, maxMinutes, totalMinutes } = useMemo(() => {
    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
    const activityMap = new Map<string, number>();
    let max = 0;
    let total = 0;

    for (const entry of dailyActivity) {
      activityMap.set(entry.date, entry.totalMinutes);
      if (entry.totalMinutes > max) max = entry.totalMinutes;
      total += entry.totalMinutes;
    }

    // firstDayOfWeek: 0=Sun, 1=Mon … adjust so Monday=0
    const firstDay = getDay(new Date(year, month - 1, 1));
    const mondayOffset = (firstDay + 6) % 7; // Mon-based offset

    const cells: { date: string; minutes: number; day: number }[] = [];

    // Leading empty cells
    for (let i = 0; i < mondayOffset; i++) {
      cells.push({ date: "", minutes: 0, day: 0 });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const minutes = activityMap.get(dateStr) ?? 0;
      cells.push({ date: dateStr, minutes, day: d });
    }

    return { cells, maxMinutes: max, totalMinutes: total };
  }, [year, month, dailyActivity]);

  const formatDuration = (m: number) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min > 0 ? min + "m" : ""}`.trim() : `${min}m`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <CardTitle>Daily Activity Heatmap</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading..."
                : `${totalMinutes > 0 ? formatDuration(totalMinutes) + " total" : "No activity recorded"}`}
            </CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Less</span>
            {INTENSITY_CLASSES.map((cls, i) => (
              <div key={i} className={`h-3 w-3 rounded-sm ${cls} border border-border/30`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-destructive">Failed to load heatmap.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            {/* Day headers */}
            <div className="mb-1 grid grid-cols-7 gap-1.5">
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((cell, idx) => {
                if (!cell.date) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }
                const level = getIntensityLevel(cell.minutes, maxMinutes);
                const intensityClass = INTENSITY_CLASSES[level];
                return (
                  <div
                    key={cell.date}
                    title={
                      cell.minutes > 0
                        ? `${format(new Date(cell.date + "T00:00:00"), "MMM d")} — ${formatDuration(cell.minutes)}`
                        : format(new Date(cell.date + "T00:00:00"), "MMM d")
                    }
                    className={`group relative flex aspect-square cursor-default items-center justify-center rounded-sm border border-border/20 text-[10px] font-medium transition-all duration-150 hover:scale-110 hover:shadow-sm ${intensityClass}`}
                  >
                    <span
                      className={`${level >= 3 ? "text-white" : "text-muted-foreground"}`}
                    >
                      {cell.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
