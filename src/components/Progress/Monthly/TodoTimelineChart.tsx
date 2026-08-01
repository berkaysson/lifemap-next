"use client";

import { useMemo } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartWrapper } from "../ChartWrapper";
import { DailyTodoEntry } from "@/services/progress/getMonthlyReport";
import { getDaysInMonth, format } from "date-fns";

type Props = {
  todoTimeline: DailyTodoEntry[];
  year: number;
  month: number; // 1-indexed
  isLoading: boolean;
  isError: boolean;
  monthLabel: string;
};

const chartConfig: ChartConfig = {
  cumulativeCompleted: {
    label: "Todos Completed",
    color: "var(--chart-2)",
  },
};

export function TodoTimelineChart({
  todoTimeline,
  year,
  month,
  isLoading,
  isError,
  monthLabel,
}: Props) {
  const chartData = useMemo(() => {
    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
    const map = new Map<string, number>();
    for (const entry of todoTimeline) {
      map.set(entry.date, entry.cumulativeCompleted);
    }

    // Fill all days, carry forward cumulative value
    const result: { day: string; cumulativeCompleted: number }[] = [];
    let lastValue = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const val = map.get(dateStr);
      if (val !== undefined) lastValue = val;
      result.push({
        day: format(new Date(dateStr + "T00:00:00"), "d MMM"),
        cumulativeCompleted: lastValue,
      });
    }

    return result;
  }, [todoTimeline, year, month]);

  const totalCompleted = todoTimeline.length > 0
    ? todoTimeline[todoTimeline.length - 1].cumulativeCompleted
    : 0;

  return (
    <ChartWrapper
      title="Todo Completion Timeline"
      description={`${monthLabel} — cumulative todos completed over time`}
      isLoading={isLoading}
      isError={isError}
      hasData={totalCompleted > 0}
      noDataMessage="No completed todos found for this month."
      showTimeframeToggle={false}
    >
      <ChartContainer config={chartConfig} className="w-full h-[280px]">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 8, right: 16 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            interval="preserveStartEnd"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={24}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`${value}`, "Todos completed"]}
              />
            }
          />
          <Line
            type="stepAfter"
            dataKey="cumulativeCompleted"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartWrapper>
  );
}
