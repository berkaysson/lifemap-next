import { formatDate, isExpired } from "@/lib/time";
import { HabitProgress, Period } from "@prisma/client";
import IsCompleted from "../ui/IsCompleted";

const HabitProgressesListItem = ({
  progress,
  period,
}: {
  progress: HabitProgress;
  period: Period;
}) => {
  const expired = isExpired(progress.endDate);

  return (
    <li className="border rounded-sm p-2 space-y-1">
      <div>
        {period === Period.DAILY
          ? formatDate(progress.startDate)
          : `${formatDate(progress.startDate)} / ${formatDate(
              progress.endDate
            )}`}
      </div>
      <div className="flex flex-row gap-2">
        <IsCompleted isCompleted={progress.completed} isExpired={expired} />
        <h2 className="font-bold">{progress.order}. Repeat</h2>
      </div>

      <div>
        {progress.completedDuration}/{progress.goalDuration}
      </div>
    </li>
  );
};

export default HabitProgressesListItem;
