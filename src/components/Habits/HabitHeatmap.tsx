import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useMemo, useEffect } from "react";
import { HabitProgress } from "@prisma/client";

interface HeatmapValue {
  date: Date;
  count: number;
  percentage: number;
  completedDuration: number;
  goalDuration: number;
  colorCode: string;
}

interface HabitHeatmapProps {
  habitProgresses: HabitProgress[];
  colorCode: string;
}

const HabitHeatmap = ({ habitProgresses, colorCode }: HabitHeatmapProps) => {
  const heatmapData = useMemo(() => {
    return habitProgresses.map(
      (progress): HeatmapValue => ({
        date: progress.startDate,
        count: progress.completed ? 1 : 0,
        percentage:
          progress.goalDuration > 0
            ? (progress.completedDuration / progress.goalDuration) * 100
            : 0,
        completedDuration: progress.completedDuration,
        goalDuration: progress.goalDuration,
        colorCode,
      })
    );
  }, [habitProgresses, colorCode]);

  const startDate = useMemo(() => {
    if (habitProgresses.length === 0) return new Date();
    return habitProgresses[0].startDate;
  }, [habitProgresses]);

  const endDate = useMemo(() => {
    if (habitProgresses.length === 0) return new Date();
    return habitProgresses[habitProgresses.length - 1].endDate;
  }, [habitProgresses]);

  const getColorClass = (value: any): string => {
    if (!value || !(value as HeatmapValue)) return "color-empty";

    const heatmapValue = value as HeatmapValue;
    const completed = heatmapValue.completedDuration;
    const goal = heatmapValue.goalDuration;
    const baseColor = heatmapValue.colorCode || "#4ade80";

    const opacity =
      completed === 0
        ? "10"
        : completed >= goal
        ? "100"
        : completed >= goal * 0.8
        ? "80"
        : completed >= goal * 0.6
        ? "60"
        : completed >= goal * 0.3
        ? "40"
        : "20";

    return `color-${baseColor.substring(1)}-${opacity}`;
  };

  const colorStyles = useMemo(() => {
    const baseColor = colorCode || "#4ade80";
    const styleId = `heatmap-style-${baseColor.substring(1)}`;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;

    const cssRules = `
      .react-calendar-heatmap .color-${baseColor.substring(1)}-100 { 
        fill: ${baseColor} !important;
        stroke: #000000;
        stroke-width: 1px;
      }
      .react-calendar-heatmap .color-${baseColor.substring(
        1
      )}-80 { fill: ${baseColor}cc !important; }
      .react-calendar-heatmap .color-${baseColor.substring(
        1
      )}-60 { fill: ${baseColor}99 !important; }
      .react-calendar-heatmap .color-${baseColor.substring(
        1
      )}-40 { fill: ${baseColor}66 !important; }
      .react-calendar-heatmap .color-${baseColor.substring(
        1
      )}-20 { fill: ${baseColor}33 !important; }
      .react-calendar-heatmap .color-${baseColor.substring(
        1
      )}-10 { fill: ${baseColor}1a !important; }
      .react-calendar-heatmap .color-empty { fill: #ebedf0 !important; }
    `;

    styleElement.textContent = cssRules;

    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(styleElement);

    return () => {
      styleElement.remove();
    };
  }, [colorCode]);

  useEffect(() => {
    return () => {
      colorStyles();
    };
  }, [colorStyles]);

  return (
    <div className="w-full">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={getColorClass}
        titleForValue={(value) => {
          if (!value) return "No data";
          return `${value.date.toLocaleDateString()}: ${value.percentage.toFixed(
            0
          )}% completed (${value.completedDuration}/${
            value.goalDuration
          } minutes)`;
        }}
      />
    </div>
  );
};

export default HabitHeatmap;
