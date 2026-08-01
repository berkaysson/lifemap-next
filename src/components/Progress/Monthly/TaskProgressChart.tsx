"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ChartWrapper } from "../ChartWrapper";
import { MonthlyTaskStat } from "@/services/progress/getMonthlyReport";

type Props = {
  taskStats: MonthlyTaskStat[];
  isLoading: boolean;
  isError: boolean;
  month: string;
};

const chartConfig: ChartConfig = {
  completedDuration: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  goalDuration: {
    label: "Goal",
    color: "var(--chart-3)",
  },
};

const formatMinutes = (v: number) => {
  const h = Math.floor(Number(v) / 60);
  return h > 0 ? `${h}h` : `${Math.round(Number(v))}m`;
};

export function TaskProgressChart({ taskStats, isLoading, isError, month }: Props) {
  const chartData = useMemo(() => {
    if (!taskStats || taskStats.length === 0) return [];
    // Truncate long names for legibility
    return taskStats.map((t) => ({
      name: t.name.length > 18 ? t.name.slice(0, 16) + "…" : t.name,
      completedDuration: t.completedDuration,
      goalDuration: t.goalDuration,
    }));
  }, [taskStats]);

  return (
    <ChartWrapper
      title="Task Progress"
      description={`${month} — completed vs. goal duration per task`}
      isLoading={isLoading}
      isError={isError}
      hasData={chartData.length > 0}
      noDataMessage="No tasks found for this month."
      showTimeframeToggle={false}
    >
      <ChartContainer config={chartConfig} className="w-full h-[320px]">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 8, right: 8, bottom: 40 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            angle={-35}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={formatMinutes}
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  formatMinutes(Number(value)),
                  name === "completedDuration" ? "Completed" : "Goal",
                ]}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="goalDuration"
            fill="var(--chart-3)"
            radius={[4, 4, 0, 0]}
            opacity={0.4}
          />
          <Bar
            dataKey="completedDuration"
            fill="var(--chart-1)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </ChartWrapper>
  );
}
