"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { Task } from "@prisma/client";
import { useContext } from "react";
import { Button } from "../ui/button";

const TaskListItem = ({ task }: { task: Task }) => {
  const { categories } = useContext(CategoryContext);

  const category = categories.find((c) => c.id === task.categoryId);
  const expired = isExpired(task.endDate);
  const remained = getRemainingTime(task.endDate);

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <span className="mr-2 text-xl">
          {task.completed ? "🟢" : expired ? "🔴" : "🟡"}
        </span>
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
        <Button variant={"outline"} size={"sm"}>
          Edit
        </Button>
        <Button variant={"destructive"} size={"sm"}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default TaskListItem;
