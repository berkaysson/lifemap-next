import { formatDate } from "@/lib/time";
import { HabitProgress } from "@prisma/client";
import IsCompleted from "../ui/IsCompleted";

const HabitProgressesListItem = ({ progress }: { progress: HabitProgress }) => {
  const isExpired = progress.endDate && new Date() > new Date(progress.endDate);

  return (
    <li className="border rounded-sm p-2 space-y-1">
      <div>
        {formatDate(progress.startDate)} - {formatDate(progress.endDate)}
      </div>
      <div className="flex flex-row gap-2">
        <IsCompleted isCompleted={progress.completed} isExpired={isExpired} />
        <h2 className="font-bold">{progress.order}. Repeat</h2>
      </div>

      <div>
        {progress.completedDuration}/{progress.goalDuration}
      </div>
    </li>
  );
};

export default HabitProgressesListItem;
