"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  format,
  addWeeks,
  subWeeks,
  endOfDay,
  startOfDay,
  startOfWeek,
  formatISO,
} from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useFetchCategories } from "@/queries/categoryQueries";
import { useFetchWeeklyCategoryActivitiesSummary } from "@/queries/progressQueries";

import { ChartWrapper } from "./ChartWrapper";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WeeklyCategoryActivitiesSummaryChart() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [offset, setOffset] = useState(0);
  const [desktopTimeframe, setDesktopTimeframe] = useState<"1m" | "3m">("3m");

  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchCategories();

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const timeframe = isMobile ? "1m" : desktopTimeframe;
  const step = useMemo(() => (timeframe === "1m" ? 4 : 12), [timeframe]);
  const selectedCategory = useMemo(() => {
    return categories?.find((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const {
    data: responseData,
    isLoading: isLoadingChartData,
    isError,
  } = useFetchWeeklyCategoryActivitiesSummary({
    categoryId: selectedCategoryId!,
    weekOffset: offset,
  });

  const emailVerifiedDate = useMemo(() => {
    const iso = (session?.user as any)?.emailVerified as string | undefined;
    return iso ? new Date(iso) : null;
  }, [session]);

  const minOffset = useMemo(() => {
    if (!emailVerifiedDate) return -Infinity;
    const verifiedStart = startOfDay(emailVerifiedDate);
    let currentOffset = 0;
    while (true) {
      const nextOffset = currentOffset - step;
      const windowEnd = endOfDay(addWeeks(new Date(), nextOffset));
      const windowStart = subWeeks(windowEnd, 12);
      if (windowStart >= verifiedStart) {
        currentOffset = nextOffset;
      } else {
        break;
      }
    }
    return currentOffset;
  }, [emailVerifiedDate, step]);

  const { description, noDataMessage } = useMemo(() => {
    const categoryName = selectedCategory?.name || "selected category";
    const periodLabel = timeframe === "1m" ? "Month" : "3 Months";
    if (offset === 0) {
      return {
        description: `Last ${periodLabel}`,
        noDataMessage: `No '${categoryName}' activity for the last ${periodLabel.toLowerCase()}.`,
      };
    }
    const endDate = addWeeks(new Date(), offset);
    const weeksToSubtract = timeframe === "1m" ? 4 : 12;
    const startDate = subWeeks(endDate, weeksToSubtract);
    return {
      description: `${format(startDate, "MMM d")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`,
      noDataMessage: `No '${categoryName}' activity for this period.`,
    };
  }, [offset, timeframe, selectedCategory]);

  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      duration: {
        label: selectedCategory?.name || "Activity",
        color: "var(--chart-1)",
        icon: Activity,
      },
    };
  }, [selectedCategory]);

  const processedData = useMemo(() => {
    const endDate = endOfDay(addWeeks(new Date(), offset));
    const weeksToSubtract = timeframe === "1m" ? 4 : 12;
    const startDate = startOfDay(subWeeks(endDate, weeksToSubtract));

    const dataMap = new Map<string, number>();
    if (responseData) {
      for (const item of responseData) {
        const weekKey = formatISO(
          startOfWeek(new Date(item.weekStartDate), { weekStartsOn: 1 }),
          { representation: "date" }
        );
        dataMap.set(weekKey, item.totalDuration);
      }
    }

    const allWeeks: Date[] = [];
    let currentWeek = startOfWeek(startDate, { weekStartsOn: 1 });
    const finalWeek = startOfWeek(endDate, { weekStartsOn: 1 });

    while (currentWeek <= finalWeek) {
      allWeeks.push(currentWeek);
      currentWeek = addWeeks(currentWeek, 1);
    }

    const chartData = allWeeks.map((weekDate) => {
      const weekKey = formatISO(weekDate, { representation: "date" });
      const duration = dataMap.get(weekKey) || 0;
      return {
        week: format(weekDate, "d MMM"),
        duration: duration,
      };
    });

    return { chartData };
  }, [responseData, timeframe, offset]);

  const handleTimeframeChange = (value: "1m" | "3m") => {
    if (value) {
      setDesktopTimeframe(value);
      setOffset(0);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setOffset(0);
  };

  return (
    <ChartWrapper
      title={`Weekly Activity: ${selectedCategory?.name || "..."}`}
      description={description}
      isLoading={isLoadingChartData || !selectedCategory}
      isError={isError}
      hasData={!!processedData?.chartData}
      noDataMessage={noDataMessage}
      timeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      onPrevious={() => setOffset((prev) => Math.max(prev - step, minOffset))}
      onNext={() => setOffset((prev) => Math.min(prev + step, 0))}
      isPreviousDisabled={offset <= minOffset}
      isNextDisabled={offset >= 0}
      showTimeframeToggle={!isMobile}
      customControls={
        !isLoadingCategories &&
        categories &&
        categories.length > 1 && (
          <Select
            value={selectedCategoryId || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[240px] h-8">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    >
      {processedData && (
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <AreaChart
            accessibilityLayer
            data={processedData.chartData}
            margin={{ left: 8, right: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <YAxis
              tickFormatter={(v) => `${Math.round(Number(v) / 60)}h`}
              tickLine={false}
              axisLine={false}
              width={24}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Area
              dataKey="duration"
              type="step"
              fill="var(--chart-1)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </ChartWrapper>
  );
}
