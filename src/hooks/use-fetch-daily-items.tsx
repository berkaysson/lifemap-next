import { useFetchDailyItemsToday } from "@/queries/dashboardQueries";
import { useSession } from "next-auth/react";

export const useFetchDailyItems = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useFetchDailyItemsToday();

  if (!userId || isLoading || !data) {
    return {
      todos: [],
      tasks: [],
      habitProgresses: [],
      isLoading: true,
    };
  }

  return {
    todos: data.todos,
    tasks: data.tasks,
    habitProgresses: data.habitProgresses,
    isLoading: false,
  };
};
