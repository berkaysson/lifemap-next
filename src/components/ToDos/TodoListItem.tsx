"use client";

import { useState } from "react";
import { Button } from "../ui/Buttons/button";
import { getRemainingTime, isExpired } from "@/lib/time";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import TodoEditForm from "./TodoEditForm";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import {
  TODO_QUERY_KEY,
  useDeleteTodo,
  useUpdateTodo,
  useArchiveTodo,
} from "@/queries/todoQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFetchProjects,
  useAddToDoToProject,
  useRemoveToDoFromProject,
} from "@/queries/projectQueries";

const TodoListItem = ({ todo }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { data: projects = [] } = useFetchProjects();
  const { mutateAsync: deleteTodo } = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();
  const addToProjectMutation = useAddToDoToProject();
  const removeFromProjectMutation = useRemoveToDoFromProject();
  const queryClient = useQueryClient();
  const { mutateAsync: archiveTodo } = useArchiveTodo();

  const todoProject = projects.find((project) => project.id === todo.projectId);
  const expired = isExpired(todo.endDate);
  const remained = todo.endDate && getRemainingTime(todo.endDate);

  const handleDelete = async () => {
    await deleteTodo(todo.id);
  };

  const handleComplete = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodoMutation.mutateAsync(updatedTodo);
  };

  const handleAddToProject = async () => {
    if (selectedProjectId && !todoProject) {
      await addToProjectMutation.mutateAsync({
        entityId: todo.id,
        projectId: selectedProjectId,
      });
      queryClient.invalidateQueries({
        queryKey: [TODO_QUERY_KEY, todo.userId],
      });
    }
  };

  const handleDeleteFromProject = async () => {
    if (todoProject) {
      await removeFromProjectMutation.mutateAsync({
        entityId: todo.id,
        projectId: todoProject.id,
      });
      queryClient.invalidateQueries({
        queryKey: [TODO_QUERY_KEY, todo.userId],
      });
    }
  };

  const handleArchive = async () => {
    await archiveTodo(todo.id);
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
        <span>{todo.endDate && todo.endDate.toISOString().slice(0, 10)}</span>
        {!todo.completed && todo.endDate && (
          <span>
            {remained} {expired ? "expired" : "remaining"}
          </span>
        )}
        <div className="flex flex-row gap-2">
          {todoProject ? (
            <div className="flex flex-row gap-2 items-center">
              <span>{todoProject.name}</span>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handleDeleteFromProject}
                disabled={removeFromProjectMutation.isPending}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <ProjectSelect
                onSelect={(projectId) => setSelectedProjectId(projectId)}
              />
              <Button
                disabled={
                  selectedProjectId === null || addToProjectMutation.isPending
                }
                onClick={handleAddToProject}
                size={"sm"}
                variant={"outline"}
              >
                Add to Project
              </Button>
            </>
          )}
        </div>
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
        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Archive"}
          onConfirm={handleArchive}
        />
      </div>
    </li>
  );
};

export default TodoListItem;
