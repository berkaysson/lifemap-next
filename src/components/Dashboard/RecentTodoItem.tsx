"use client";

import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { useArchiveTodo, useUpdateTodo } from "@/queries/todoQueries";
import { isExpired } from "@/lib/time";

import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";
import TodoEditForm from "../ToDos/TodoEditForm";

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
    <div className="flex flex-col gap-2 p-2 border rounded-lg hover:bg-accent/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        </div>

        <TodoEditForm
          initialValues={todo}
          triggerButton={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Iconify icon="solar:pen-new-square-bold-duotone" width={18} />
            </Button>
          }
        />
      </div>

      <span className="text-sm font-medium truncate w-full">{todo.name}</span>
    </div>
  );
};

export default RecentTodoItem;
