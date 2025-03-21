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
import { lazy, Suspense, useState } from "react";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";

const LazyTaskForm = lazy(() => import("./TaskForm"));

const ArchivedTaskListItem = ({ task }) => {
  const expired = isExpired(task.endDate);
  const deleteArchivedTask = useDeleteArchivedTask();
  const [isFormOpen, setIsFormOpen] = useState(false);

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

          <div className="text-sm text-shade">
            <div>Start: {task.startDate.toLocaleDateString()}</div>
            <div>Due: {task.endDate.toLocaleDateString()}</div>
            <div>Archived: {task.archivedAt.toLocaleDateString()}</div>
            <div>
              Progress: {task.completedDuration}/{task.goalDuration}
            </div>
            <div>Activity Type: {task.categoryName}</div>
          </div>
          {task.project && (
            <div className="text-sm">
              Project: <span className="font-medium">{task.project.name}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 flex-wrap">
        <ButtonWithConfirmation
          buttonText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
          icon="solar:trash-bin-trash-bold"
        />
        <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
          <Iconify icon="solar:archive-up-bold" width={20} />
          Recreate
        </Button>
      </CardFooter>
      {isFormOpen && (
        <Suspense fallback={null}>
          <LazyTaskForm
            useArea="archive"
            defaultValues={{
              name: task.name,
              description: task.description,
              goalDuration: task.goalDuration,
              categoryId: task.categoryId,
              startDate: task.startDate.toISOString().split("T")[0],
              endDate:
                new Date(task.endDate) < new Date()
                  ? ""
                  : task.endDate.toISOString().split("T")[0],
              colorCode: task.colorCode,
            }}
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
          />
        </Suspense>
      )}
    </Card>
  );
};

export default ArchivedTaskListItem;
