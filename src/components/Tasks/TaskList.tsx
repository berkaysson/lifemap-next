"use client";

import { useCallback, useEffect, useState } from "react";
import TaskListItem from "./TaskListItem";
import ArchivedTaskListItem from "./ArchivedTaskListItem";
import { Task } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { ExtendedTask } from "@/types/Entitities";
import { useFetchTasks, useFetchArchivedTasks } from "@/queries/taskQueries";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/Buttons/button";
import { Badge } from "../ui/badge";

const TaskList = () => {
  const [isArcihivedOpen, setIsArcihivedOpen] = useState(false);

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
    if (tasks && tasks.length > 0) {
      const sorted = sortArrayOfObjectsByKey<ExtendedTask>(
        tasks,
        "name",
        "desc"
      )
      setSortedTasks(sorted);
    }
  }, [tasks]);

  useEffect(() => {
    if (archivedTasks && archivedTasks.length > 0) {
      const sorted = sortArrayOfObjectsByKey(archivedTasks, "name", "desc");
      setSortedArchivedTasks(sorted);
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
      {/*  Tasks Section */}
      <section>
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
        {sortedTasks.length === 0 && !isLoading && (
          <div className="opacity-80 mt-2">No tasks found.</div>
        )}
        <ul className="rounded-sm grid grid-cols-1 gap-4 mt-4">
          {sortedTasks.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </ul>
      </section>

      <Separator className="my-4" />

      {/* Archived Tasks Section */}
      <section>
        <Collapsible
          open={isArcihivedOpen}
          onOpenChange={setIsArcihivedOpen}
          className="w-full space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <span>Archived Tasks</span>
              <Badge className="ml-2">{sortedArchivedTasks.length}</Badge>
              {isArcihivedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {sortedArchivedTasks.length > 0 ? (
              <>
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
                  <div>
                    Error loading archived tasks: {errorArchived.message}
                  </div>
                )}
                <ul className="rounded-sm grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3">
                  {sortedArchivedTasks.map((task) => (
                    <ArchivedTaskListItem key={task.id} task={task} />
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No archived tasks found.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  );
};

export default TaskList;
