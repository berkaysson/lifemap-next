import { useMemo } from "react";
import HeatMap, { HeatMapValue } from "@uiw/react-heat-map";
import { HabitProgress } from "@prisma/client";
import { Tooltip } from "react-tooltip";
import { formatDateFriendly } from "@/lib/time";
import { useTheme } from "next-themes";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface HabitHeatmapProps {
  habitProgresses: HabitProgress[];
  colorCode: string;
}

const HabitHeatmap = ({ habitProgresses, colorCode }: HabitHeatmapProps) => {
  const { theme } = useTheme();

  const heatmapData = useMemo(() => {
    return habitProgresses.map((progress) => ({
      date: progress.startDate.toISOString().split("T")[0],
      count: progress.completedDuration / progress.goalDuration,
      completedDuration: progress.completedDuration,
      goalDuration: progress.goalDuration,
    }));
  }, [habitProgresses]);

  const startDate = useMemo(() => {
    if (habitProgresses.length === 0)
      return new Date().toISOString().split("T")[0];
    return habitProgresses[0].startDate.toISOString().split("T")[0];
  }, [habitProgresses]);

  const endDate = useMemo(() => {
    if (habitProgresses.length === 0)
      return new Date().toISOString().split("T")[0];
    return habitProgresses[habitProgresses.length - 1].endDate
      .toISOString()
      .split("T")[0];
  }, [habitProgresses]);

  const getColorScale = (baseColor: string) => {
    return {
      0: `${baseColor}15`, // Empty/incomplete
      0.25: `${baseColor}30`, // 25% opacity
      0.5: `${baseColor}50`, // 50% opacity
      0.75: `${baseColor}60`, // 75% opacity
      1: baseColor, // Full color
      zeroGoal: theme === "dark" ? "#1C252E" : "#FFFFFF", // No goal duration or goalDuration is 0
    };
  };

  const columnCount = useMemo(
    () => Math.floor(heatmapData.length / 6 + 1),
    [heatmapData]
  );
  const heatmapWidth = useMemo(
    () => columnCount * (32 + 4) + 24,
    [columnCount]
  );
  return (
    <div className="w-full">
      <ScrollArea
        type="always"
        className="w-full whitespace-nowrap rounded-md border"
      >
        <div
          className="flex whitespace-nowrap [&_svg.w-heatmap_rect:active]:!fill-secondary"
          style={{
            width: heatmapWidth + "px",
          }}
        >
          <HeatMap
            value={heatmapData}
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            panelColors={getColorScale(colorCode)}
            rectProps={{ rx: 4 }}
            rectSize={32}
            space={4}
            style={{
              color: theme === "dark" ? "#FFFFFF" : "#1C252E",
            }}
            height={350}
            width="100%"
            rectRender={(
              props,
              data: HeatMapValue & {
                column: number;
                row: number;
                index: number;
              }
            ) => {
              const customData = heatmapData.find(
                (item) => item.date === data.date
              ) || {
                completedDuration: 0,
                goalDuration: 0,
                count: 0,
              };
              const ratio = customData.count || 0;
              const colors = getColorScale(colorCode);
              let color = colors[0];

              const today = new Date();
              const cellDate = new Date(data.date);
              const isToday =
                today.getFullYear() === cellDate.getFullYear() &&
                today.getMonth() === cellDate.getMonth() &&
                today.getDate() === cellDate.getDate();

              if (customData.goalDuration === 0) {
                color = colors.zeroGoal;
              } else if (ratio > 0.75) {
                color = colors[1];
              } else if (ratio > 0.5) {
                color = colors[0.75];
              } else if (ratio > 0.25) {
                color = colors[0.5];
              } else if (ratio > 0) {
                color = colors[0.25];
              }

              return (
                <g>
                  <rect
                    {...props}
                    fill={color}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={`Date: ${formatDateFriendly(
                      data.date
                    )}
      Completed: ${customData.completedDuration}/${customData.goalDuration}`}
                    stroke={
                      isToday ? (theme === "dark" ? "white" : "black") : "none"
                    }
                    strokeWidth={isToday ? 1 : 0}
                  />
                  {ratio >= 1 && (
                    <text
                      x={Number(props.x ?? 0) + Number(props.width ?? 0) / 2}
                      y={Number(props.y ?? 0) + Number(props.height ?? 0) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="16"
                      fill="white"
                    >
                      ✓
                    </text>
                  )}
                </g>
              );
            }}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default HabitHeatmap;
