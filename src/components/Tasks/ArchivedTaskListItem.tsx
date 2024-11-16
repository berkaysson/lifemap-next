"use client";

import { isExpired } from "@/lib/time";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { useDeleteArchivedTask } from "@/queries/taskQueries";

const ArchivedTaskListItem = ({ task }) => {
  const expired = isExpired(task.endDate);
  const deleteArchivedTask = useDeleteArchivedTask();

  const handleDelete = () => {
    deleteArchivedTask.mutate(task.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex">
        <div className="flex flex-col gap-2">
          <div>
            <span className="mr-2 text-xl flex gap-2">
              <IsCompleted isCompleted={task.completed} isExpired={expired} />
              <ColorCircle colorCode={task.colorCode || "darkblue"} />
            </span>
            <span>{task.name}</span>
          </div>
          {task.description && <div>{task.description}</div>}
          <div className="text-sm text-muted-foreground">
            <div>Start: {task.startDate.toLocaleDateString()}</div>
            <div>Due: {task.endDate.toLocaleDateString()}</div>
            <div>Archived: {task.archivedAt.toLocaleDateString()}</div>
            <div>
              Progress: {task.completedDuration}/{task.goalDuration}
            </div>
            <div>Category: {task.categoryName}</div>
          </div>
          {task.project && (
            <div className="text-sm">
              Project: <span className="font-medium">{task.project.name}</span>
            </div>
          )}
        </div>
        <ButtonWithConfirmation
          buttonText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </div>
    </li>
  );
};

export default ArchivedTaskListItem;
