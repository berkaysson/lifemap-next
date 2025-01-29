"use client";

import { isExpired } from "@/lib/time";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { useDeleteArchivedTask } from "@/queries/taskQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";

const ArchivedTaskListItem = ({ task }) => {
  const expired = isExpired(task.endDate);
  const deleteArchivedTask = useDeleteArchivedTask();

  const handleDelete = () => {
    deleteArchivedTask.mutate(task.id);
  };

  return (
    <Card className="w-full mb-1 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-1 items-center p-1 pb-0">
        <ColorCircle colorCode={task.colorCode || "darkblue"} />
        <IsCompleted isCompleted={task.completed} isExpired={expired} />
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{task.name}</h3>
      </CardHeader>
      <CardContent className="flex">
        <div className="flex flex-col gap-1">
          <CardDescription>
            {task.description && <div>{task.description}</div>}
          </CardDescription>

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
      </CardContent>
      <CardFooter className="flex justify-end">
        <ButtonWithConfirmation
          buttonText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </CardFooter>
    </Card>
  );
};

export default ArchivedTaskListItem;
