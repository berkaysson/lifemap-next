"use client";

import { useFetchTodos } from "@/queries/todoQueries";
import { isToday } from "@/lib/time";
import RecentTodoItem from "./RecentTodoItem";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";

const RecentTodos = () => {
  const { data: todos = [] } = useFetchTodos();

  const sortedTodos = todos.sort((a, b) => {
    const aIsToday = a.endDate && isToday(new Date(a.endDate));
    const bIsToday = b.endDate && isToday(new Date(b.endDate));

    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const recentTodos = sortedTodos.slice(0, 5);

  return (
    <div className="space-y-4">
      {recentTodos.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Todos</h2>
            <Button asChild size="sm" variant="link" className="w-auto">
              <Link href={"/dashboard/todo"}>All Todos</Link>
            </Button>
          </div>
          <div className="flex flex-col flex-wrap gap-2">
            {recentTodos.map((todo) => (
              <RecentTodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentTodos;
