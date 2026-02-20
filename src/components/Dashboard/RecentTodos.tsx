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

  const recentTodos = sortedTodos;

  return (
    <>
      {recentTodos.length > 0 && (
        <div className="space-y-4 px-2 sm:px-4">
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Todos</h2>
              <Button asChild size="sm" variant="link" className="w-auto">
                <Link href={"/dashboard/todo"}>All Todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recentTodos.map((todo) => (
                <RecentTodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default RecentTodos;
