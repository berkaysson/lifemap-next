import { formatDateFriendly } from "@/lib/time";
import { cn, getContrastColor } from "@/lib/utils";
import React from "react";

interface ProgressBlockProps {
  startDate: Date;
  endDate: Date;
  completedDuration: number;
  goalDuration: number;
  colorCode?: string;
  width?: number;
  height?: number;
  tooltipId: string;
  isCurrentPeriod?: boolean;
  className?: string;
  period: "DAILY" | "WEEKLY" | "MONTHLY";
}

const ProgressBlock = ({
  startDate,
  endDate,
  completedDuration,
  goalDuration,
  colorCode = "#3B82F6",
  width = 32,
  height = 32,
  tooltipId,
  isCurrentPeriod = false,
  className,
  period,
}: ProgressBlockProps) => {
  const getIntensityLevel = (completed: number, goal: number) => {
    if (completed === 0) return 0;
    const percentage = completed / goal;
    if (percentage <= 0.25) return 0.25;
    if (percentage <= 0.5) return 0.5;
    if (percentage <= 0.75) return 0.75;
    return 1;
  };

  const getBlockColor = (level: number) => {
    const baseColor = colorCode;
    const colorMap = {
      0: `linear-gradient(135deg, ${baseColor}10 0%, ${baseColor}15 100%)`,
      0.25: `linear-gradient(135deg, ${baseColor}20 0%, ${baseColor}30 100%)`,
      0.5: `linear-gradient(135deg, ${baseColor}40 0%, ${baseColor}50 100%)`,
      0.75: `linear-gradient(135deg, ${baseColor}50 0%, ${baseColor}60 100%)`,
      1: `linear-gradient(135deg, ${baseColor}80 0%, ${baseColor} 100%)`,
    };
    return colorMap[level as keyof typeof colorMap];
  };

  const level = getIntensityLevel(completedDuration, goalDuration);
  const isCompleted = completedDuration >= goalDuration;

  const contrastColor = getContrastColor(colorCode);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${period === "DAILY" ? height : 96}px`,
        border: isCurrentPeriod ? `1px solid lightgray` : "none",
        backgroundImage: getBlockColor(level),
        boxShadow: isCompleted ? `0 0 8px ${colorCode}` : "none",
      }}
      className={cn(
        "rounded-lg cursor-pointer transition-colors duration-200 relative active:!bg-secondary",
        className
      )}
      data-tooltip-id={tooltipId}
      data-tooltip-content={`${formatDateFriendly(startDate)}
- ${formatDateFriendly(endDate)}
${completedDuration}/${goalDuration}`}
    >
      {isCompleted && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] text-${contrastColor}`}
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
};

export default ProgressBlock;
