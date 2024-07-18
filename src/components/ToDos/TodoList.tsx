"use client";

import { TodoContext } from "@/contexts/TodoContext";
import { useContext } from "react";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
  const { todos } = useContext(TodoContext);

  return <div className="flex flex-col gap-2 m-2 border rounded-sm">
    {todos.map(todo => <TodoListItem key={todo.id} todo={todo} />)}
  </div>;
};

export default TodoList;
