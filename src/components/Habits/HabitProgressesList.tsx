import { HabitProgress, Period } from "@prisma/client";
import HabitProgressesListItem from "./HabitProgressesListItem";
import HabitHeatmap from "./HabitHeatmap";

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
        <ul className="flex flex-row gap-1 flex-wrap">
          {habitProgresses.map((habitProgress) => (
            <HabitProgressesListItem
              key={habitProgress.id}
              progress={habitProgress}
              period={period}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitProgressesList;
