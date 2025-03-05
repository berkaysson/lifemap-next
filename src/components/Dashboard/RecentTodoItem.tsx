"use client";

import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { useArchiveTodo, useUpdateTodo } from "@/queries/todoQueries";
import { isExpired } from "@/lib/time";

const RecentTodoItem = ({ todo }) => {
  const updateTodoMutation = useUpdateTodo();
  const { mutateAsync: archiveTodo } = useArchiveTodo();
  const expired = isExpired(todo.endDate);

  const handleComplete = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodoMutation.mutateAsync(updatedTodo);
    if (updatedTodo.completed) await archiveTodo(todo.id);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 p-1 sm:p-2 border rounded-lg">
      <ColorCircle colorCode={todo.colorCode || "darkblue"} />

      <LoadingButton
        isLoading={updateTodoMutation.isPending}
        loadingText=""
        variant={"outline"}
        size={"icon"}
        onClick={handleComplete}
        className="h-8 w-8"
      >
        <IsCompleted isCompleted={todo.completed} isExpired={expired} />
      </LoadingButton>

      <span className="text-sm font-medium truncate max-w-[180px] min-[550px]:max-w-[400px]">
        {todo.name}
      </span>
    </div>
  );
};

export default RecentTodoItem;
