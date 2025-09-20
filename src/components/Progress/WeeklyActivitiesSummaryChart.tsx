"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, addMonths, subMonths, endOfDay, startOfDay } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { useFetchWeeklyActivitiesSummary } from "@/queries/progressQueries";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "../ui/Buttons/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [desktopTimeframe, setDesktopTimeframe] = useState<"1m" | "3m">("3m");
  const isMobile = useIsMobile();

  // On mobile, always show the monthly view. On desktop, use the selected state.
  const timeframe = isMobile ? "1m" : desktopTimeframe;

  const [offset, setOffset] = useState(0);
  const { data: session } = useSession();

  const step = useMemo(() => (timeframe === "1m" ? 1 : 3), [timeframe]);

  const emailVerifiedDate = useMemo(() => {
    const iso = (session?.user as any)?.emailVerified as string | undefined;
    return iso ? new Date(iso) : null;
  }, [session]);

  const minOffset = useMemo(() => {
    if (!emailVerifiedDate) return 0; // safe default
    const verifiedStart = startOfDay(emailVerifiedDate);
    let currentOffset = 0;
    while (true) {
      const nextOffset = currentOffset - step;
      const windowEnd = endOfDay(addMonths(new Date(), nextOffset));
      const windowStart = subMonths(windowEnd, step);
      if (windowStart >= verifiedStart) {
        currentOffset = nextOffset;
      } else {
        break;
      }
    }
    return currentOffset;
  }, [emailVerifiedDate, step]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchWeeklyActivitiesSummary(offset);

  const weeklyData = response?.data;

  const { chartData, chartConfig, allCategories } = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) {
      return { chartData: [], chartConfig: {}, allCategories: [] };
    }

    let dataToProcess = weeklyData;

    // If monthly view is selected, filter the fetched data to the specific month.
    if (timeframe === "1m") {
      const monthEndDate = endOfDay(addMonths(new Date(), offset));
      const monthStartDate = startOfDay(subMonths(monthEndDate, 1));
      dataToProcess = weeklyData.filter((week) => {
        const weekDate = new Date(week.weekStartDate);
        return weekDate >= monthStartDate && weekDate <= monthEndDate;
      });
    }

    if (dataToProcess.length === 0) {
      return { chartData: [], chartConfig: {}, allCategories: [] };
    }

    const categorySet = new Set<string>();
    dataToProcess.forEach((week) => {
      Object.keys(week.categoryBreakdown).forEach((category) => {
        categorySet.add(category);
      });
    });
    const allCategories = Array.from(categorySet);

    const chartConfig: ChartConfig = {};
    allCategories.forEach((category, index) => {
      chartConfig[category] = {
        label: category,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      };
    });

    const chartData = dataToProcess.map((week) => {
      const weekLabel = format(new Date(week.weekStartDate), "MMM d");
      const categoryDurations = week.categoryBreakdown;
      return {
        week: weekLabel,
        ...categoryDurations,
      };
    });

    return { chartData, chartConfig, allCategories };
  }, [weeklyData, timeframe, offset]);

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - step, minOffset));
  };

  const handleNext = () => {
    setOffset((prev) => Math.min(prev + step, 0));
  };

  const handleTimeframeChange = (value: "1m" | "3m") => {
    if (value) {
      setDesktopTimeframe(value);
      setOffset(0); // Reset to the latest period when changing view
    }
  };

  const { description, noDataMessage } = useMemo(() => {
    const periodLabel = timeframe === "1m" ? "Month" : "3 Months";
    if (offset === 0) {
      return {
        description: `Last ${periodLabel}`,
        noDataMessage: `No activity data found for the last ${periodLabel.toLowerCase()}.`,
      };
    }
    const endDate = addMonths(new Date(), offset);
    const startDate = subMonths(endDate, step);
    return {
      description: `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`,
      noDataMessage: "No activity data found for this period.",
    };
  }, [offset, timeframe, step]);

  const renderCardHeader = () => (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-1">
        <CardTitle>Weekly Activity Summary</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        {!isMobile && (
          <ToggleGroup
            type="single"
            defaultValue="3m"
            value={desktopTimeframe}
            onValueChange={handleTimeframeChange}
            aria-label="Select timeframe"
          >
            <ToggleGroupItem value="1m" aria-label="Monthly view">
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem value="3m" aria-label="3-month view">
              3 Months
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={offset <= minOffset}
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">
            Previous {step} month{step > 1 ? "s" : ""}
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={offset >= 0}
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">
            Next {step} month{step > 1 ? "s" : ""}
          </span>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex h-96 w-full items-center justify-center">
        <p className="text-destructive">
          Error fetching data:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>{renderCardHeader()}</CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-muted-foreground">{noDataMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>{renderCardHeader()}</CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[450px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${Math.round(Number(value) / 60)}h`}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            {allCategories.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={chartConfig[category]?.color}
                radius={[4, 4, 4, 4]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
