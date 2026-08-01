"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, addMonths, subMonths, endOfDay, startOfDay } from "date-fns";
import { useSession } from "next-auth/react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useFetchWeeklyActivitiesSummary } from "@/queries/progressQueries";
import { ChartWrapper } from "./ChartWrapper";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CATEGORY_COLORS = [
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
  "var(--chart-11)",
  "var(--chart-12)",
  "var(--chart-13)",
  "var(--chart-14)",
  "var(--chart-15)",
];

export function WeeklyActivitiesSummaryChart() {
  const [offset, setOffset] = useState(0);
  const [desktopTimeframe, setDesktopTimeframe] = useState<"1m" | "3m">("3m");
  const isMobile = useIsMobile();
  const timeframe = isMobile ? "1m" : desktopTimeframe;
  const step = useMemo(() => (timeframe === "1m" ? 1 : 3), [timeframe]);

  const { data: session } = useSession();
  const {
    data: response,
    isLoading,
    isError,
  } = useFetchWeeklyActivitiesSummary(offset);

  const emailVerifiedDate = useMemo(() => {
    const iso = (session?.user as any)?.emailVerified as string | undefined;
    return iso ? new Date(iso) : null;
  }, [session]);

  const minOffset = useMemo(() => {
    if (!emailVerifiedDate) return 0;
    const verifiedStart = startOfDay(emailVerifiedDate);
    let currentOffset = 0;
    while (true) {
      const nextOffset = currentOffset - step;
      const windowEnd = endOfDay(addMonths(new Date(), nextOffset));
      if (subMonths(windowEnd, step) >= verifiedStart) {
        currentOffset = nextOffset;
      } else {
        break;
      }
    }
    return currentOffset;
  }, [emailVerifiedDate, step]);

  const { description, noDataMessage } = useMemo(() => {
    const periodLabel = timeframe === "1m" ? "Month" : "3 Months";
    if (offset === 0)
      return {
        description: `Last ${periodLabel}`,
        noDataMessage: `No activity data for the last ${periodLabel.toLowerCase()}.`,
      };
    const endDate = addMonths(new Date(), offset);
    const startDate = subMonths(endDate, step);
    return {
      description: `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`,
      noDataMessage: "No activity data for this period.",
    };
  }, [offset, timeframe, step]);

  const processedData = useMemo(() => {
    if (!response?.data || response.data.length === 0) return null;
    let dataToProcess = response.data;
    if (timeframe === "1m") {
      const monthEndDate = endOfDay(addMonths(new Date(), offset));
      const monthStartDate = startOfDay(subMonths(monthEndDate, 1));
      dataToProcess = response.data.filter(
        (w) =>
          new Date(w.weekStartDate) >= monthStartDate &&
          new Date(w.weekStartDate) <= monthEndDate
      );
    }
    if (dataToProcess.length === 0) return null;
    const categorySet = new Set<string>();
    dataToProcess.forEach((w) =>
      Object.keys(w.categoryBreakdown).forEach((cat) => categorySet.add(cat))
    );
    const allCategories = Array.from(categorySet);
    const chartConfig: ChartConfig = {};
    allCategories.forEach((cat, i) => {
      chartConfig[cat] = {
        label: cat,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      };
    });
    const chartData = dataToProcess.map((w) => ({
      week:
        format(new Date(w.weekStartDate), "d MMM") +
        " - " +
        format(new Date(w.weekEndDate), "d MMM"),
      ...w.categoryBreakdown,
    }));
    return { chartData, chartConfig, allCategories };
  }, [response?.data, timeframe, offset]);

  const handleTimeframeChange = (value: "1m" | "3m") => {
    if (value) {
      setDesktopTimeframe(value);
      setOffset(0);
    }
  };

  return (
    <ChartWrapper
      title="Weekly Activity Summary"
      description={description}
      isLoading={isLoading}
      isError={isError}
      hasData={!!processedData}
      noDataMessage={noDataMessage}
      timeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      onPrevious={() => setOffset((prev) => Math.max(prev - step, minOffset))}
      onNext={() => setOffset((prev) => Math.min(prev + step, 0))}
      isPreviousDisabled={offset <= minOffset}
      isNextDisabled={offset >= 0}
      showTimeframeToggle={!isMobile}
    >
      {processedData && (
        <ChartContainer
          config={processedData.chartConfig}
          className="w-full h-[350px]"
          height={350}
        >
          <BarChart accessibilityLayer data={processedData.chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={6}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${Math.round(Number(v) / 60)}h`}
              tickLine={false}
              axisLine={false}
              width={24}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {processedData.allCategories.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={processedData.chartConfig[category]?.color}
                radius={[4, 4, 4, 4]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </ChartWrapper>
  );
}
