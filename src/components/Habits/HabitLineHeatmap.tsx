"use client";

import { formatDateFriendly } from "@/lib/time";
import type { HabitProgress } from "@prisma/client";
import { Tooltip } from "react-tooltip";

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
  const blockWidth = period === "MONTHLY" ? 32 : 16; // px values

  return (
    <div className="w-full max-w-3xl">
      {/* Heatmap Blocks */}
      <div className="grid grid-flow-col auto-cols-max gap-1 mt-1">
        {progresses.map((item) => {
          const level = getIntensityLevel(
            item.completedDuration,
            item.goalDuration
          );
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: getBlockColor(level),
                width: `${blockWidth}px`,
              }}
              className="h-24 rounded-sm cursor-pointer transition-colors duration-200"
              title={`${item.startDate.toLocaleDateString()}: ${
                item.completedDuration
              }/${item.goalDuration} completed`}
              data-tooltip-id="line-heatmap-tooltip"
              data-tooltip-content={`${formatDateFriendly(item.startDate)}
              - ${formatDateFriendly(item.endDate)}
                    ${item.completedDuration}/${item.goalDuration}`}
            />
          );
        })}
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

      <Tooltip id="line-heatmap-tooltip" />
    </div>
  );
};

export default HabitLineHeatmap;
