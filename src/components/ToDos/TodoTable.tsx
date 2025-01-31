"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ButtonWithConfirmation from "@/components/ui/Buttons/ButtonWithConfirmation";
import { formatDateFriendly, getRemainingTime, isExpired } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import { Tooltip } from "@mui/material";
import { Badge } from "../ui/badge";
import {
  useArchiveTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "@/queries/todoQueries";
import TodoEditForm from "./TodoEditForm";
import { useFetchProjects } from "@/queries/projectQueries";
import ColorCircle from "../ui/Shared/ColorCircle";
import { LoadingButton } from "../ui/Buttons/loading-button";
import IsCompleted from "../ui/Shared/IsCompleted";
import { Iconify } from "../ui/iconify";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const TodoTable = ({ sortedTodos }: { sortedTodos: any[] }) => {
  const { mutateAsync: deleteTodo } = useDeleteTodo();
  const { data: projects = [] } = useFetchProjects();
  const updateTodoMutation = useUpdateTodo();
  const { mutateAsync: archiveTodo } = useArchiveTodo();

  const handleDelete = async (Todo: any) => {
    await deleteTodo(Todo.id);
  };

  const handleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodoMutation.mutateAsync(updatedTodo);
  };

  const handleArchive = async (todo) => {
    await archiveTodo(todo.id);
  };

  return (
    <div className="space-y-4 flex">
      <ScrollArea type="always" className="w-1 flex-1">
        <div className="w-full whitespace-nowrap">
          <Table className="relative min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTodos.map((Todo) => {
                const expired = isExpired(Todo.endDate);
                const remained = Todo.endDate && getRemainingTime(Todo.endDate);
                const todoProject = projects.find(
                  (project) => project.id === Todo.projectId
                );

                return (
                  <TableRow key={Todo.id}>
                    <TableCell>
                      <LoadingButton
                        isLoading={updateTodoMutation.isPending}
                        loadingText=""
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => handleComplete(Todo)}
                      >
                        <IsCompleted
                          isCompleted={Todo.completed}
                          isExpired={expired}
                        />
                      </LoadingButton>
                    </TableCell>
                    <TableCell className="max-w-sm truncate">
                      <ColorCircle colorCode={Todo.colorCode || "darkblue"} />
                      <span className="ml-1">
                        {Todo.description ? (
                          <Tooltip arrow title={Todo.description}>
                            <span className="underline">{Todo.name}</span>
                          </Tooltip>
                        ) : (
                          Todo.name
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: Todo.colorCode || "darkblue",
                        }}
                        className="text-white whitespace-nowrap"
                      >
                        {todoProject ? todoProject.name : "No Project"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        {Todo.endDate && formatDateFriendly(Todo.endDate)}
                      </div>
                      <span>
                        {remained}{" "}
                        {(Todo.endDate && (expired ? "" : "remaining")) || ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TodoEditForm
                          initialValues={Todo}
                          triggerButton={
                            <Button variant="outline" size="sm">
                              <Iconify
                                icon="solar:pen-new-square-outline"
                                width={16}
                              />
                            </Button>
                          }
                        />
                        <ButtonWithConfirmation
                          variant="destructive"
                          size="sm"
                          buttonText=""
                          onConfirm={() => handleDelete(Todo)}
                          icon="solar:trash-bin-trash-bold"
                        />
                        <ButtonWithConfirmation
                          variant="destructive"
                          size="sm"
                          buttonText=""
                          onConfirm={() => handleArchive(Todo)}
                          icon="solar:archive-bold"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TodoTable;
