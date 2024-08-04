"use client";

import { useCallback, useContext, useState } from "react";
import TaskListItem from "./TaskListItem";
import { TaskContext } from "@/contexts/TaskContext";
import { Task } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";

const TaskList = () => {
  const { tasks } = useContext(TaskContext);
  const [sortedTasks, setSortedTasks] = useState(tasks);

  const handleSort = useCallback(
    (sortBy: keyof Task, direction: "asc" | "desc") => {
      const sorted = sortArrayOfObjectsByKey<Task>(tasks, sortBy, direction);
      setSortedTasks(sorted);
    },
    [tasks]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
          { value: "completed", label: "Completion" },
          { value: "completedDuration", label: "Completed Activity" },
          { value: "goalDuration", label: "Goal Activity" },
          { value: "startDate", label: "Start Date" },
          { value: "endDate", label: "Due Date" },
          { value: "category", label: "Category" },
        ]}
        onSelect={handleSort}
      />
      <div className="border rounded-sm">
        {sortedTasks.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
