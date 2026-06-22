"use client";

import type { HabitProgress } from "@prisma/client";
import React from "react";
import { Tooltip } from "react-tooltip";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ProgressBlock from "./ProgressBlock";

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
  const getBlockColor = (level: number) => {
    const baseColor = colorCode || "#3B82F6";
    const colorMap = {
      0: `${baseColor}10`,
      1: `${baseColor}20`,
      2: `${baseColor}30`,
      3: `${baseColor}40`,
      4: `${baseColor}50`,
      5: `${baseColor}60`,
      6: `${baseColor}70`,
      7: `${baseColor}80`,
      8: `${baseColor}90`,
      9: `${baseColor}A0`,
      10: baseColor,
    };
    return colorMap[level as keyof typeof colorMap];
  };

  // Define block width based on period
  const blockWidth = period === "MONTHLY" ? 40 : 28; // px values

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
                const today = new Date();
                const isCurrentPeriod =
                  new Date(today.setHours(0, 0, 0, 0)) >=
                    new Date(item.startDate.setHours(0, 0, 0, 0)) &&
                  new Date(today.setHours(0, 0, 0, 0)) <=
                    new Date(item.endDate.setHours(0, 0, 0, 0));

                return (
                  <ProgressBlock
                    key={item.id}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    completedDuration={item.completedDuration}
                    goalDuration={item.goalDuration}
                    colorCode={colorCode || "#3B82F6"}
                    width={blockWidth}
                    height={24}
                    tooltipId="line-heatmap-tooltip"
                    isCurrentPeriod={isCurrentPeriod}
                    period={period}
                  />
                );
              })}
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-2 text-xs text-shade mt-2">
            <div className="flex">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
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
