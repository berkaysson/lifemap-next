"use client";

import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
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
    <div className="flex items-center gap-4 p-2 border rounded-lg">
      <ColorCircle colorCode={todo.colorCode || "darkblue"} />

      {todo.projectId && (
        <Badge
          variant="outline"
          style={{ backgroundColor: todo.colorCode || "darkblue" }}
          className="text-white"
        >
          <Iconify
            icon="solar:folder-with-files-bold"
            width={16}
            className="mr-1"
          />
          {todo.projectId}
        </Badge>
      )}

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

      <span className="text-sm font-medium truncate">{todo.name}</span>
    </div>
  );
};

export default RecentTodoItem;
