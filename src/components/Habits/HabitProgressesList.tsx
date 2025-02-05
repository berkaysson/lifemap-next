import { HabitProgress, Period } from "@prisma/client";
import HabitHeatmap from "./HabitHeatmap";
import HabitLineHeatmap from "./HabitLineHeatmap";

const HabitProgressesList = ({
  habitProgresses,
  categoryName,
  period,
  colorCode,
}: {
  habitProgresses: HabitProgress[];
  categoryName: string;
  period: Period;
  colorCode: string;
}) => {
  return (
    <div className="space-y-2 p-2">
      <h2 className="font-bold">{categoryName}</h2>
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
