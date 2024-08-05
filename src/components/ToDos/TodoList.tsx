"use client";

import { TodoContext } from "@/contexts/TodoContext";
import { useCallback, useContext, useEffect, useState } from "react";
import TodoListItem from "./TodoListItem";
import { ToDo } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";

const TodoList = () => {
  const { todos } = useContext(TodoContext);
  const [sortedTodos, setSortedTodos] = useState(todos);

  useEffect(() => {
    setSortedTodos(todos);
  }, [todos]);

  const handleSort = useCallback(
    (sortBy: keyof ToDo, direction: "asc" | "desc") => {
      const sorted = sortArrayOfObjectsByKey<ToDo>(todos, sortBy, direction);
      setSortedTodos(sorted);
    },
    [todos]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
          { value: "completed", label: "Completion" },
          { value: "startDate", label: "Start Date" },
          { value: "endDate", label: "Due Date" },
        ]}
        onSelect={handleSort}
      />
      <div className="border rounded-sm">
        {sortedTodos.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
