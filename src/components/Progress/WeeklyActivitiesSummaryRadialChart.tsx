"use client";

import { useState, useEffect, useMemo } from "react";
import { ChartWrapper } from "./ChartWrapper";
import { format } from "date-fns";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardFooter } from "@/components/ui/card";
import { WeeklyActivitySummary } from "@/types/types";
import { useFetchWeeklyActivitiesSummary } from "@/queries/progressQueries";

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
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

export function WeeklyActivitiesSummaryRadialChart() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const {
    data: queryResponse,
    isLoading,
    isError,
    isSuccess,
  } = useFetchWeeklyActivitiesSummary(0);

  const weeklySummaries = useMemo(
    () => (queryResponse?.data || []) as WeeklyActivitySummary[],
    [queryResponse?.data]
  );

  useEffect(() => {
    if (isSuccess && weeklySummaries.length > 0) {
      setCurrentWeekIndex(weeklySummaries.length - 1);
    }
  }, [isSuccess, weeklySummaries.length]);

  const { chartData, chartConfig, currentWeekData } = useMemo(() => {
    const data = weeklySummaries?.[currentWeekIndex];
    if (!data || !data.categoryBreakdown) {
      return { chartData: [], chartConfig: {}, currentWeekData: null };
    }

    const transformedData = Object.entries(data.categoryBreakdown).map(
      ([name, duration], index) => ({
        name,
        duration,
        fill: COLORS[index % COLORS.length],
      })
    );

    const config: ChartConfig = transformedData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as ChartConfig);
    config.duration = { label: "Duration" };

    return {
      chartData: transformedData,
      chartConfig: config,
      currentWeekData: data,
    };
  }, [currentWeekIndex, weeklySummaries]);

  const handlePreviousWeek = () =>
    setCurrentWeekIndex((prev) => Math.max(0, prev - 1));

  const handleNextWeek = () =>
    setCurrentWeekIndex((prev) =>
      Math.min(weeklySummaries.length - 1, prev + 1)
    );

  const isPreviousWeekDisabled = currentWeekIndex <= 0;
  const isNextWeekDisabled =
    currentWeekIndex >= weeklySummaries.length - 1 ||
    weeklySummaries.length === 0;

  const cardDescription = currentWeekData
    ? `Summary for the week of ${format(
        currentWeekData.weekStartDate,
        "MMM d, yyyy"
      )}`
    : "Loading weekly data...";

  return (
    <ChartWrapper
      title="Week's Activity Summary"
      description={cardDescription}
      isLoading={isLoading}
      isError={isError}
      hasData={chartData.length > 0}
      noDataMessage="No activity data found for this period."
      onPrevious={handlePreviousWeek}
      onNext={handleNextWeek}
      isPreviousDisabled={isPreviousWeekDisabled}
      isNextDisabled={isNextWeekDisabled}
    >
      <div className="flex flex-col">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] min-h-[140px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="browser" />}
            />
            <RadialBar dataKey="duration" background>
              <LabelList
                position="insideStart"
                dataKey="name"
                className="fill-black font-semibold capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
        <CardFooter className="flex-col gap-1 pt-2 text-sm">
          <div className="font-medium leading-none">
            Total for this week:{" "}
            <span className="text-foreground">
              {formatDuration(currentWeekData?.totalDuration || 0)}
            </span>
          </div>
          <div className="text-muted-foreground leading-none">
            Time spent across all categories
          </div>
        </CardFooter>
      </div>
    </ChartWrapper>
  );
}
