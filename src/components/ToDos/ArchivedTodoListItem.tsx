"use client";

import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import { isExpired } from "@/lib/time";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { useDeleteArchivedTodo } from "@/queries/todoQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Iconify } from "../ui/iconify";

const ArchivedTodoListItem = ({ todo }) => {
  const expired = todo.endDate && isExpired(todo.endDate);
  const deleteArchivedTodo = useDeleteArchivedTodo();

  const handleDelete = () => {
    deleteArchivedTodo.mutate(todo.id);
  };

  return (
    <Card className="w-full max-w-md">
      <div className="p-1 pb-0">
        <ColorCircle colorCode={todo.colorCode || "darkblue"} />
      </div>

      <CardHeader className="p-3 pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold flex items-center gap-1">
            <span className="mr-2 text-xl flex gap-2">
              <IsCompleted isCompleted={todo.completed} isExpired={expired} />
            </span>
            {todo.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-3">
        <CardDescription>{todo.description}</CardDescription>
        <div className="flex flex-col gap-2">
          {todo.endDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Iconify
                icon="solar:calendar-date-bold"
                width={20}
                className="mr-2"
              />
              {todo.endDate.toISOString().slice(0, 10)}
            </div>
          )}
          {todo.startDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Iconify
                icon="solar:calendar-date-bold"
                width={20}
                className="mr-2"
              />
              Start: {todo.startDate.toISOString().slice(0, 10)}
            </div>
          )}
          {todo.archivedAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Iconify icon="solar:archive-bold" width={20} className="mr-2" />
              Archived: {todo.archivedAt.toISOString().slice(0, 10)}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end">
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText="Delete"
          onConfirm={handleDelete}
        />
      </CardFooter>
    </Card>
  );
};

export default ArchivedTodoListItem;
