"use client";

import { useContext } from "react";
import { Button } from "../ui/button";
import { TodoContext } from "@/contexts/TodoContext";

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

  const handleDelete = async () => {
    await onDeleteTodo(todo.id);
  };

  const handleComplete = async () => {
    todo.completed = !todo.completed;
    await onUpdateTodo(todo);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div
        className={`flex flex-row gap-2  ${
          todo.completed ? "line-through" : ""
        }`}
      >
        <span>{todo.name}</span>
        <span>{todo.colorCode}</span>
        <span>{todo.completed}</span>
        <span>{todo.startDate.toISOString().slice(0, 10)}</span>/
        <span>{todo.endDate.toISOString().slice(0, 10)}</span>
      </div>
      <div>{todo.description}</div>
      <div className="flex flex-row gap-2">
        <Button variant={"outline"} size={"sm"} onClick={handleComplete}>
          {todo.completed ? "Uncomplete" : "Complete"}
        </Button>
        <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default TodoListItem;
