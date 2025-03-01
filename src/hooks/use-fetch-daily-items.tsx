import { useFetchHabitProgressesEndingToday } from "@/queries/habitQueries";
import { useFetchTasks } from "@/queries/taskQueries";
import { useFetchTodos } from "@/queries/todoQueries";
import { useSession } from "next-auth/react";

export const useFetchDailyItems = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: todos, isLoading: todosLoading } = useFetchTodos();
  const { data: tasks, isLoading: tasksLoading } = useFetchTasks();
  const { data: habitProgresses, isLoading: habitProgressesLoading } =
    useFetchHabitProgressesEndingToday();

  if (!userId || todosLoading || tasksLoading || habitProgressesLoading) {
    return {
      todos: [],
      tasks: [],
      habitProgresses: [],
      isLoading: true,
    };
  }

  // Filter todos and tasks that are due today
  const today = new Date().toISOString().split("T")[0];
  const filteredTodos =
    todos?.filter(
      (todo) =>
        todo.endDate &&
        new Date(todo.endDate).toISOString().split("T")[0] === today
    ) || [];

  const filteredTasks =
    tasks?.filter(
      (task) =>
        task.endDate &&
        new Date(task.endDate).toISOString().split("T")[0] === today
    ) || [];

  return {
    todos: filteredTodos,
    tasks: filteredTasks,
    habitProgresses: habitProgresses || [],
    isLoading: false,
  };
};
