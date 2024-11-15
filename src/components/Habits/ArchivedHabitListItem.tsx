"use client";

import { isExpired } from "@/lib/time";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";

const ArchivedHabitListItem = ({ habit }) => {
  const expired = isExpired(habit.endDate);

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-col gap-2">
        <div>
          <span className="mr-2 text-xl flex gap-2">
            <IsCompleted isCompleted={habit.completed} isExpired={expired} />
            <ColorCircle colorCode={habit.colorCode || "darkblue"} />
          </span>
          <span>{habit.name}</span>
        </div>
        {habit.description && <div>{habit.description}</div>}
        <div className="text-sm text-muted-foreground">
          <div>Start: {habit.startDate.toLocaleDateString()}</div>
          <div>Due: {habit.endDate.toLocaleDateString()}</div>
          <div>Archived: {habit.archivedAt.toLocaleDateString()}</div>
          <div>Period: {habit.period}</div>
          <div>Best Streak: {habit.bestStreak} days</div>
          <div>Final Streak: {habit.currentStreak} days</div>
          <div>Category: {habit.categoryName}</div>
        </div>
        {habit.project && (
          <div className="text-sm">
            Project: <span className="font-medium">{habit.project.name}</span>
          </div>
        )}
      </div>
    </li>
  );
};

export default ArchivedHabitListItem;
