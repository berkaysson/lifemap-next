"use client";

import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import { isExpired } from "@/lib/time";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { useDeleteArchivedTodo } from "@/queries/todoQueries";

const ArchivedTodoListItem = ({ todo }) => {
  const expired = todo.endDate && isExpired(todo.endDate);
  const deleteArchivedTodo = useDeleteArchivedTodo();

  const handleDelete = () => {
    deleteArchivedTodo.mutate(todo.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex">
        <div className="flex flex-col gap-2">
          <div>
            <span className="mr-2 text-xl flex gap-2">
              {todo.endDate && (
                <IsCompleted isCompleted={todo.completed} isExpired={expired} />
              )}
              <ColorCircle colorCode={todo.colorCode || "darkblue"} />
            </span>
            <span>{todo.name}</span>
          </div>
          {todo.description && <div>{todo.description}</div>}
          <div className="text-sm text-muted-foreground">
            <div>Start: {todo.startDate.toLocaleDateString()}</div>
            {todo.endDate && (
              <div>Due: {todo.endDate.toLocaleDateString()}</div>
            )}
            <div>Archived: {todo.archivedAt.toLocaleDateString()}</div>
          </div>
          {todo.project && (
            <div className="text-sm">
              Project: <span className="font-medium">{todo.project.name}</span>
            </div>
          )}
        </div>
        <ButtonWithConfirmation
          buttonText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </div>
    </li>
  );
};

export default ArchivedTodoListItem;
