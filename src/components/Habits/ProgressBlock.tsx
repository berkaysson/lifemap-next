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
  const getIntensityLevel = (completed: number, goal: number): number => {
    if (completed === 0) return 0;
    const percentage = completed / goal;
    if (percentage <= 0.1) return 1;
    if (percentage <= 0.2) return 2;
    if (percentage <= 0.3) return 3;
    if (percentage <= 0.4) return 4;
    if (percentage <= 0.5) return 5;
    if (percentage <= 0.6) return 6;
    if (percentage <= 0.7) return 7;
    if (percentage <= 0.8) return 8;
    if (percentage <= 0.9) return 9;
    return 10;
  };

  const getBlockColor = (level: number) => {
    const baseColor = colorCode;
    const colorMap = {
      0: `linear-gradient(135deg, ${baseColor}10 0%, ${baseColor}15 100%)`,
      1: `linear-gradient(135deg, ${baseColor}20 0%, ${baseColor}28 100%)`,
      2: `linear-gradient(135deg, ${baseColor}30 0%, ${baseColor}3B 100%)`,
      3: `linear-gradient(135deg, ${baseColor}40 0%, ${baseColor}4E 100%)`,
      4: `linear-gradient(135deg, ${baseColor}50 0%, ${baseColor}61 100%)`,
      5: `linear-gradient(135deg, ${baseColor}60 0%, ${baseColor}73 100%)`,
      6: `linear-gradient(135deg, ${baseColor}70 0%, ${baseColor}85 100%)`,
      7: `linear-gradient(135deg, ${baseColor}80 0%, ${baseColor}96 100%)`,
      8: `linear-gradient(135deg, ${baseColor}90 0%, ${baseColor}A8 100%)`,
      9: `linear-gradient(135deg, ${baseColor}A0 0%, ${baseColor}B9 100%)`,
      10: `linear-gradient(135deg, ${baseColor}B0 0%, ${baseColor} 100%)`,
    };
    return colorMap[level as keyof typeof colorMap];
  };

  const level = getIntensityLevel(completedDuration, goalDuration);
  const isCompleted = completedDuration >= goalDuration;

  const contrastColor = getContrastColor(colorCode);

  const formattedStart = formatDateFriendly(startDate, false);
  const formattedEnd = formatDateFriendly(endDate, false);
  const isSameDay = formattedStart === formattedEnd;
  const isExceeded = completedDuration > goalDuration;
  const diffValue = Math.abs(goalDuration - completedDuration);

  const tooltipContent = `${formattedStart}${
    isSameDay ? "" : ` - ${formattedEnd}`
  }
${completedDuration}/${goalDuration} (${
    isExceeded ? "Exceeded" : "Remained"
  }: ${diffValue})`;

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
        className,
      )}
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
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
