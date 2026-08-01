"use client";

import { useMemo } from "react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartWrapper } from "../ChartWrapper";
import { MonthlyHabitStat } from "@/services/progress/getMonthlyReport";

type Props = {
  habitStats: MonthlyHabitStat[];
  isLoading: boolean;
  isError: boolean;
  month: string;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
];

export function MonthlyHabitRadialChart({ habitStats, isLoading, isError, month }: Props) {
  const { chartData, chartConfig } = useMemo(() => {
    if (!habitStats || habitStats.length === 0) {
      return { chartData: [], chartConfig: {} };
    }

    const sorted = [...habitStats].sort(
      (a, b) => a.completionRate - b.completionRate,
    );

    const chartData = sorted.map((habit, idx) => ({
      name: habit.name,
      value: habit.completionRate,
      fill: habit.colorCode ?? COLORS[idx % COLORS.length],
    }));

    const chartConfig: ChartConfig = sorted.reduce(
      (acc, habit, idx) => {
        acc[habit.name] = {
          label: habit.name,
          color: habit.colorCode ?? COLORS[idx % COLORS.length],
        };
        return acc;
      },
      {} as ChartConfig,
    );
    chartConfig.value = { label: "Completion %" };

    return { chartData, chartConfig };
  }, [habitStats]);

  return (
    <ChartWrapper
      title="Habit Completion Rate"
      description={`${month} — completion % per habit`}
      isLoading={isLoading}
      isError={isError}
      hasData={chartData.length > 0}
      noDataMessage="No active habits found for this month."
      showTimeframeToggle={false}
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto max-h-[360px] min-h-[240px] w-full"
      >
        <RadialBarChart
          data={chartData}
          startAngle={-90}
          endAngle={380}
          innerRadius={30}
          outerRadius={120}
        >
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="name"
                formatter={(value) => [`${value}%`, "Completion"]}
              />
            }
          />
          <RadialBar dataKey="value" background maxBarSize={20}>
            <LabelList
              position="insideStart"
              dataKey="name"
              className="fill-black font-semibold capitalize mix-blend-luminosity"
              fontSize={10}
            />
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
    </ChartWrapper>
  );
}
