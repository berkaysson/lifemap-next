"use client";

import { useCallback, useEffect, useState } from "react";
import TaskListItem from "./TaskListItem";
import { Task } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedTask } from "@/types/Entitities";
import { useFetchTasks } from "@/queries/taskQueries";

const TaskList = () => {
  const { data: tasks, isLoading, isError, error } = useFetchTasks();
  const [sortedTasks, setSortedTasks] = useState(tasks || []);

  useEffect(() => {
    if (tasks) {
      setSortedTasks(tasks);
    }
  }, [tasks]);

  const handleSort = useCallback(
    (sortBy: keyof Task, direction: "asc" | "desc") => {
      if (!tasks) return;
      const sorted = sortArrayOfObjectsByKey<ExtendedTask>(
        tasks,
        sortBy,
        direction
      );
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
      {isLoading && <div>Loading categories...</div>}
      {isError && <div>Error loading categories: {error.message}</div>}
      <ul className="border rounded-sm">
        {sortedTasks.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
