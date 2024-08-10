import { HabitProgress } from "@prisma/client";
import HabitProgressesListItem from "./HabitProgressesListItem";

const HabitProgressesList = ({
  habitProgresses,
  categoryName,
}: {
  habitProgresses: HabitProgress[];
  categoryName: string;
}) => {
  return (
    <div className="space-y-2 p-2">
      <h2 className="font-bold">{categoryName}</h2>
      <ul className="flex flex-row gap-1 flex-wrap">
        {habitProgresses.map((habitProgress) => (
          <HabitProgressesListItem
            key={habitProgress.id}
            progress={habitProgress}
          />
        ))}
      </ul>
    </div>
  );
};

export default HabitProgressesList;
