"use client";

import { formatDateFriendly } from "@/lib/time";
import type { HabitProgress } from "@prisma/client";
import React from "react";
import { Tooltip } from "react-tooltip";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

interface HabitLineHeatmapProps {
  period: "DAILY" | "WEEKLY" | "MONTHLY";
  progresses: HabitProgress[];
  colorCode?: string | null;
}

const HabitLineHeatmap = ({
  period,
  progresses,
  colorCode,
}: HabitLineHeatmapProps) => {
  const getIntensityLevel = (
    completedDuration: number,
    goalDuration: number
  ) => {
    if (completedDuration === 0) return 0;
    const percentage = completedDuration / goalDuration;
    if (percentage <= 0.25) return 0.25;
    if (percentage <= 0.5) return 0.5;
    if (percentage <= 0.75) return 0.75;
    return 1;
  };

  const getBlockColor = (level: number) => {
    const baseColor = colorCode || "#3B82F6";
    const colorMap = {
      0: `${baseColor}10`,
      0.25: `${baseColor}30`,
      0.5: `${baseColor}50`,
      0.75: `${baseColor}60`,
      1: baseColor,
    };
    return colorMap[level as keyof typeof colorMap];
  };

  // Define block width based on period
  const blockWidth = period === "MONTHLY" ? 32 : 24; // px values

  return (
    <div className="w-full">
      <ScrollArea
        type="always"
        className="w-full whitespace-nowrap rounded-md border"
      >
        <div className="flex flex-col p-4 whitespace-nowrap w-full relative">
          <div className="relative">
            {/* Month Labels Row */}
            <div className="absolute left-0 flex gap-1 text-xs">
              {progresses
                .reduce(
                  (acc: { month: string; position: number }[], item, index) => {
                    const currentMonth = new Intl.DateTimeFormat("en-US", {
                      month: "short",
                    }).format(new Date(item.startDate));

                    if (!acc.find(({ month }) => month === currentMonth)) {
                      acc.push({ month: currentMonth, position: index });
                    }

                    return acc;
                  },
                  []
                )
                .map(({ month, position }) => (
                  <div
                    key={month}
                    className="absolute"
                    style={{ left: `${position * (blockWidth + 4)}px` }}
                  >
                    {month}
                  </div>
                ))}
            </div>

            {/* Heatmap Blocks */}
            <div className="grid grid-flow-col auto-cols-max gap-1 mt-8">
              {progresses.map((item) => {
                const level = getIntensityLevel(
                  item.completedDuration,
                  item.goalDuration
                );
                const isCompleted = item.completedDuration >= item.goalDuration;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: getBlockColor(level),
                      width: `${blockWidth}px`,
                    }}
                    className="h-24 rounded-sm cursor-pointer transition-colors duration-200 relative"
                    title={`${item.startDate.toLocaleDateString()}: ${
                      item.completedDuration
                    }/${item.goalDuration} completed`}
                    data-tooltip-id="line-heatmap-tooltip"
                    data-tooltip-content={`${formatDateFriendly(item.startDate)}
              - ${formatDateFriendly(item.endDate)}
                    ${item.completedDuration}/${item.goalDuration}`}
                  >
                    {isCompleted && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          "text-white",
                          period === "MONTHLY" ? "w-8 h-8" : "w-6 h-6"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <div className="flex">
              {[0, 0.25, 0.5, 0.75, 1].map((level) => (
                <div
                  key={level}
                  style={{ backgroundColor: getBlockColor(level) }}
                  className="w-3 h-3"
                />
              ))}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Tooltip id="line-heatmap-tooltip" />
    </div>
  );
};

export default HabitLineHeatmap;
