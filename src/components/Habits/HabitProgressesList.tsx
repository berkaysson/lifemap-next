import { HabitProgress, Period } from "@prisma/client";
import HabitHeatmap from "./HabitHeatmap";
import HabitLineHeatmap from "./HabitLineHeatmap";

const HabitProgressesList = ({
  habitProgresses,
  period,
  colorCode,
}: {
  habitProgresses: HabitProgress[];
  period: Period;
  colorCode: string;
}) => {
  return (
    <div className="space-y-2 p-1">
      {period === "DAILY" ? (
        <HabitHeatmap habitProgresses={habitProgresses} colorCode={colorCode} />
      ) : (
        <HabitLineHeatmap
          period={period}
          progresses={habitProgresses}
          colorCode={colorCode}
        />
      )}
    </div>
  );
};

export default HabitProgressesList;
