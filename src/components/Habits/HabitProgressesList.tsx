import { HabitProgress, Period } from "@prisma/client";
import HabitProgressesListItem from "./HabitProgressesListItem";

const HabitProgressesList = ({
  habitProgresses,
  categoryName,
  period
}: {
  habitProgresses: HabitProgress[];
  categoryName: string;
  period: Period
}) => {
  return (
    <div className="space-y-2 p-2">
      <h2 className="font-bold">{categoryName}</h2>
      <ul className="flex flex-row gap-1 flex-wrap">
        {habitProgresses.map((habitProgress) => (
          <HabitProgressesListItem
            key={habitProgress.id}
            progress={habitProgress}
            period={period}
          />
        ))}
      </ul>
    </div>
  );
};

export default HabitProgressesList;
