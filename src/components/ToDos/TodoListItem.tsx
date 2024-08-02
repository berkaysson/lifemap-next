"use client";

import { useContext } from "react";
import { Button } from "../ui/button";
import { TodoContext } from "@/contexts/TodoContext";
import { getRemainingTime, isExpired } from "@/lib/time";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import TodoEditForm from "./TodoEditForm";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";

const TodoListItem = ({
  todo,
}: {
  todo: {
    id: string;
    name: string;
    description: string | null;
    colorCode: string | null;
    completed: boolean;
    startDate: Date;
    endDate: Date;
    userId: string;
    projectId: string | null;
  };
}) => {
  const { onDeleteTodo, onUpdateTodo } = useContext(TodoContext);

  const expired = isExpired(todo.endDate);
  let remained = getRemainingTime(todo.endDate);

  const handleDelete = async () => {
    await onDeleteTodo(todo.id);
  };

  const handleComplete = async () => {
    todo.completed = !todo.completed;
    await onUpdateTodo(todo);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-col gap-2">
        <div>
          <span className="mr-2 text-xl flex gap-2">
            <IsCompleted isCompleted={todo.completed} isExpired={expired} />
            <ColorCircle colorCode={todo.colorCode || "darkblue"} />
          </span>
          <span>{todo.name}</span>
        </div>
        <div>{todo.description}</div>
        <span>{todo.endDate.toISOString().slice(0, 10)}</span>
        {!todo.completed && (
          <span>
            {remained} {expired ? "expired" : "remaining"}
          </span>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <Button variant={"outline"} size={"sm"} onClick={handleComplete}>
          {todo.completed ? "Uncomplete" : "Complete"}
        </Button>
        <TodoEditForm
          initialValues={todo}
          triggerButton={
            <Button variant={"outline"} size={"sm"}>
              Edit
            </Button>
          }
        />

        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Delete"}
          onConfirm={handleDelete}
        />
      </div>
    </li>
  );
};

export default TodoListItem;
