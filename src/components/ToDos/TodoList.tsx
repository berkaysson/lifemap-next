"use client";

import { useCallback, useEffect, useState } from "react";
import TodoListItem from "./TodoListItem";
import { ToDo } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchTodos, useFetchArchivedTodos } from "@/queries/todoQueries";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import ArchivedTodoListItem from "./ArchivedTodoListItem";
import ListViewToggle from "../ui/Buttons/list-view-toggle";
import TodoTable from "./TodoTable";
import { Button } from "../ui/Buttons/button";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import Loading from "@/app/(protected)/dashboard/todo/loading";

const TodoList = () => {
  const [isArcihivedOpen, setIsArcihivedOpen] = useState(false);

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { data: todos, isLoading, isError, error } = useFetchTodos();
  const {
    data: archivedTodos,
    isLoading: isLoadingArchived,
    isError: isErrorArchived,
    error: errorArchived,
  } = useFetchArchivedTodos();

  const [sortedTodos, setSortedTodos] = useState<ToDo[]>(todos || []);
  const [sortedArchivedTodos, setSortedArchivedTodos] = useState(
    archivedTodos || []
  );

  useEffect(() => {
    if (todos && todos.length > 0) {
      const sorted = sortArrayOfObjectsByKey<ToDo>(todos, "name", "desc");
      setSortedTodos(sorted);
    }
  }, [todos]);

  useEffect(() => {
    if (archivedTodos && archivedTodos.length > 0) {
      const sorted = sortArrayOfObjectsByKey(archivedTodos, "name", "desc");
      setSortedArchivedTodos(sorted);
    }
  }, [archivedTodos]);

  const handleSort = useCallback(
    (sortBy: keyof ToDo, direction: "asc" | "desc") => {
      if (!todos || !todos.length) return;
      const sorted = sortArrayOfObjectsByKey<ToDo>(todos, sortBy, direction);
      setSortedTodos(sorted);
    },
    [todos]
  );

  const handleArchiveSort = useCallback(
    (sortBy: keyof ToDo, direction: "asc" | "desc") => {
      if (!archivedTodos || !archivedTodos.length) return;
      const sorted = sortArrayOfObjectsByKey(archivedTodos, sortBy, direction);
      setSortedArchivedTodos(sorted);
    },
    [archivedTodos]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 m-2">
      {/*  Todos Section */}
      <section>
        <div className="flex sm:flex-row justify-between flex-col-reverse gap-2 mb-4">
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

        {isError && <div>Error loading todos: {error.message}</div>}
        {sortedTodos.length === 0 && !isLoading && (
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

      <section>
        <Collapsible
          open={isArcihivedOpen}
          onOpenChange={setIsArcihivedOpen}
          className="w-full space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <span>Archived Todos</span>
              <Badge className="ml-2">{sortedArchivedTodos.length}</Badge>
              {isArcihivedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {sortedArchivedTodos.length > 0 ? (
              <>
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
                  <div>
                    Error loading archived todos: {errorArchived.message}
                  </div>
                )}
                <ul className="rounded-sm grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3">
                  {sortedArchivedTodos.map((todo) => (
                    <ArchivedTodoListItem key={todo.id} todo={todo} />
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-shade">
                No archived todos found.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  );
};

export default TodoList;
