import { Suspense, lazy } from "react";
import { Skeleton } from "../ui/Misc/skeleton";

const TodoForm = lazy(() => import("../ToDos/TodoForm"));
const TaskForm = lazy(() => import("../Tasks/TaskForm"));
const HabitForm = lazy(() => import("../Habits/HabitForm"));

const QuickActions = () => {
  return (
    <div className="mb-3 sm:mb-4 px-2 sm:px-2">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 px-1">
        <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
          <TodoForm useArea="dashboard" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
          <TaskForm useArea="dashboard" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
          <HabitForm useArea="dashboard" />
        </Suspense>
      </div>
    </div>
  );
};

export default QuickActions;
