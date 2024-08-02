"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { Task } from "@prisma/client";
import { useContext } from "react";
import { Button } from "../ui/button";
import { TaskContext } from "@/contexts/TaskContext";
import TaskEditForm from "./TaskEditForm";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";

const TaskListItem = ({ task }: { task: Task }) => {
  const { categories } = useContext(CategoryContext);
  const { onDeleteTask } = useContext(TaskContext);

  const category = categories.find((c) => c.id === task.categoryId);
  const expired = isExpired(task.endDate);
  const remained = getRemainingTime(task.endDate);

  const handleDelete = async () => {
    await onDeleteTask(task.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <IsCompleted isCompleted={task.completed} isExpired={expired} />
        <ColorCircle colorCode={task.colorCode || "darkblue"} />
        <span>{task.name}</span>
        <span>{task.description}</span>
        <span>{category?.name}</span>
      </div>
      <div>
        <div>
          {task.completedDuration}/{task.goalDuration}
        </div>
        <span>
          {formatDate(task.startDate)} - {formatDate(task.endDate)}
        </span>
        <div>
          {expired ? "Expired" : "ends"} {remained}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <TaskEditForm
          initialValues={task}
          triggerButton={
            <Button variant={"outline"} size={"sm"}>
              Edit
            </Button>
          }
        />
        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Delete"}
          onConfirm={handleDelete}
        />
      </div>
    </li>
  );
};

export default TaskListItem;
