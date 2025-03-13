"use client";

import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchTasks } from "@/queries/taskQueries";
import TaskListItem from "../Tasks/TaskListItem";
import { useState } from "react";
import { Iconify } from "../ui/iconify";

const RecentTasks = () => {
  const { data: tasks = [] } = useFetchTasks();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedTasks = tasks.sort((a, b) => {
    const aIsToday = a.endDate && isToday(new Date(a.endDate));
    const bIsToday = b.endDate && isToday(new Date(b.endDate));

    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedTasks.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedTasks.length - 1 : prev - 1));
  };

  const currentTask = sortedTasks[currentIndex];

  return (
    <div className="space-y-2 px-2 sm:px-4">
      {currentTask && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Task</h2>
            <Button asChild size="sm" variant="link" className="w-auto">
              <Link href={"/dashboard/task"}>All Tasks</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <TaskListItem
              key={currentTask.id}
              task={currentTask}
              mode="light"
            />
            <div className="flex justify-between mt-1">
              <Button
                size={"icon"}
                className="h-8 w-8"
                onClick={handlePrev}
                variant="outline"
              >
                <Iconify icon="solar:alt-arrow-left-bold" width={16} />
                <span className="sr-only">Previous</span>
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {sortedTasks.length} task
              </span>
              <Button
                size={"icon"}
                onClick={handleNext}
                variant="outline"
                className="h-8 w-8"
              >
                <Iconify icon="solar:alt-arrow-right-bold" width={16} />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentTasks;
