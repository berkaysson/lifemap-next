"use client";

import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchTasks } from "@/queries/taskQueries";
import TaskListItem from "../Tasks/TaskListItem";

const RecentTasks = () => {
  const { data: tasks = [] } = useFetchTasks();

  const sortedTasks = tasks.sort((a, b) => {
    const aIsToday = a.endDate && isToday(new Date(a.endDate));
    const bIsToday = b.endDate && isToday(new Date(b.endDate));

    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const recentTask = sortedTasks[0];

  return (
    <div className="space-y-2">
      {recentTask && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Task</h2>
            <Button asChild size="sm" variant="link" className="w-auto">
              <Link href={"/dashboard/task"}>All Tasks</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <TaskListItem key={recentTask.id} task={recentTask} mode="light" />
          </div>
        </>
      )}
    </div>
  );
};

export default RecentTasks;
