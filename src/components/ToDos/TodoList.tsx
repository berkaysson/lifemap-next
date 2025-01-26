"use client";

import { useCallback, useEffect, useState } from "react";
import TodoListItem from "./TodoListItem";
import { ToDo } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchTodos, useFetchArchivedTodos } from "@/queries/todoQueries";
import { Separator } from "../ui/separator";
// import ArchivedTodoListItem from "./ArchivedTodoListItem";
import ListViewToggle from "../ui/Buttons/list-view-toggle";
import TodoTable from "./TodoTable";

const TodoList = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { data: todos, isLoading, isError, error } = useFetchTodos();
  // const {
  //   data: archivedTodos,
  //   isLoading: isLoadingArchived,
  //   isError: isErrorArchived,
  //   error: errorArchived,
  // } = useFetchArchivedTodos();

  const [sortedTodos, setSortedTodos] = useState<ToDo[]>(todos || []);
  // const [sortedArchivedTodos, setSortedArchivedTodos] = useState(
  //   archivedTodos || []
  // );

  useEffect(() => {
    if (todos) {
      setSortedTodos(todos);
    }
  }, [todos]);

  // useEffect(() => {
  //   if (archivedTodos) {
  //     setSortedArchivedTodos(archivedTodos);
  //   }
  // }, [archivedTodos]);

  const handleSort = useCallback(
    (sortBy: keyof ToDo, direction: "asc" | "desc") => {
      if (!todos) return;
      const sorted = sortArrayOfObjectsByKey<ToDo>(todos, sortBy, direction);
      setSortedTodos(sorted);
    },
    [todos]
  );

  // const handleArchiveSort = useCallback(
  //   (sortBy: keyof ToDo, direction: "asc" | "desc") => {
  //     if (!archivedTodos) return;
  //     const sorted = sortArrayOfObjectsByKey(archivedTodos, sortBy, direction);
  //     setSortedArchivedTodos(sorted);
  //   },
  //   [archivedTodos]
  // );

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* Active Todos Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Active Todos</h2>
        <div className="flex sm:flex-row justify-between flex-col-reverse gap-2">
          <SelectSort
            options={[
              { value: "name", label: "Name" },
              { value: "completed", label: "Completion" },
              { value: "startDate", label: "Start Date" },
              { value: "endDate", label: "Due Date" },
            ]}
            onSelect={handleSort}
          />
          <div>
            <ListViewToggle
              currentView={viewMode}
              onSelect={(view) => setViewMode(view)}
            />
          </div>
        </div>

        {isLoading && <div>Loading todos...</div>}
        {isError && <div>Error loading todos: {error.message}</div>}
        {sortedTodos.length === 0 && (
          <div className="opacity-80 mt-2">No todos found.</div>
        )}

        {viewMode === "grid" && (
          <ul className="rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {sortedTodos.map((todo) => (
              <TodoListItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}

        {viewMode === "table" && <TodoTable sortedTodos={sortedTodos} />}
      </section>

      <Separator className="my-4" />

      {/* Archived Todos Section */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-2">Archived Todos</h2>
        <SelectSort
          options={[
            { value: "name", label: "Name" },
            { value: "completed", label: "Completion" },
            { value: "startDate", label: "Start Date" },
            { value: "endDate", label: "Due Date" },
            { value: "archivedAt", label: "Archive Date" },
          ]}
          onSelect={handleArchiveSort}
        />
        {isLoadingArchived && <div>Loading archived todos...</div>}
        {isErrorArchived && (
          <div>Error loading archived todos: {errorArchived.message}</div>
        )}
        <ul className="rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {sortedArchivedTodos.map((todo) => (
            <ArchivedTodoListItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section> */}
    </div>
  );
};

export default TodoList;
