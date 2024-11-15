"use client";

import { useCallback, useEffect, useState } from "react";
import TaskListItem from "./TaskListItem";
import ArchivedTaskListItem from "./ArchivedTaskListItem";
import { Task } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedTask } from "@/types/Entitities";
import { useFetchTasks, useFetchArchivedTasks } from "@/queries/taskQueries";
import { Separator } from "../ui/separator";

const TaskList = () => {
  const { data: tasks, isLoading, isError, error } = useFetchTasks();
  const {
    data: archivedTasks,
    isLoading: isLoadingArchived,
    isError: isErrorArchived,
    error: errorArchived,
  } = useFetchArchivedTasks();

  const [sortedTasks, setSortedTasks] = useState<ExtendedTask[]>(tasks || []);
  const [sortedArchivedTasks, setSortedArchivedTasks] = useState(
    archivedTasks || []
  );

  useEffect(() => {
    if (tasks) {
      setSortedTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (archivedTasks) {
      setSortedArchivedTasks(archivedTasks);
    }
  }, [archivedTasks]);

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

  const handleArchiveSort = useCallback(
    (sortBy: keyof Task, direction: "asc" | "desc") => {
      if (!archivedTasks) return;
      const sorted = sortArrayOfObjectsByKey(archivedTasks, sortBy, direction);
      setSortedArchivedTasks(sorted);
    },
    [archivedTasks]
  );

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* Active Tasks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Active Tasks</h2>
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
        {isLoading && <div>Loading tasks...</div>}
        {isError && <div>Error loading tasks: {error.message}</div>}
        <ul className="border rounded-sm mt-2">
          {sortedTasks.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </ul>
      </section>

      <Separator className="my-4" />

      {/* Archived Tasks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Archived Tasks</h2>
        <SelectSort
          options={[
            { value: "name", label: "Name" },
            { value: "completed", label: "Completion" },
            { value: "completedDuration", label: "Completed Activity" },
            { value: "goalDuration", label: "Goal Activity" },
            { value: "startDate", label: "Start Date" },
            { value: "endDate", label: "Due Date" },
            { value: "archivedAt", label: "Archive Date" },
          ]}
          onSelect={handleArchiveSort}
        />
        {isLoadingArchived && <div>Loading archived tasks...</div>}
        {isErrorArchived && (
          <div>Error loading archived tasks: {errorArchived.message}</div>
        )}
        <ul className="border rounded-sm mt-2">
          {sortedArchivedTasks.map((task) => (
            <ArchivedTaskListItem key={task.id} task={task} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TaskList;
