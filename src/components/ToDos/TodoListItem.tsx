"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { getRemainingTime, isExpired } from "@/lib/time";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import TodoEditForm from "./TodoEditForm";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { ProjectContext } from "@/contexts/ProjectContext";
import ProjectSelect from "../ui/ProjectSelect";
import { useDeleteTodo, useUpdateTodo } from "@/queries/todoQueries";

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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { mutateAsync: deleteTodo } = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();
  const { projects, onAddToDoToProject, onDeleteToDoFromProject } =
    useContext(ProjectContext);

  const todoProject = projects.find((project) => project.id === todo.projectId);

  const expired = isExpired(todo.endDate);
  let remained = getRemainingTime(todo.endDate);

  const handleDelete = async () => {
    await deleteTodo(todo.id);
  };

  const handleComplete = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodoMutation.mutateAsync(updatedTodo);
  };

  const handleAddToProject = () => {
    if (selectedProjectId && !todoProject) {
      onAddToDoToProject(todo.id, selectedProjectId);
    }
  };

  const handleDeleteFromProject = () => {
    if (todoProject) {
      onDeleteToDoFromProject(todo.id, todoProject.id);
    }
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
        <div className="flex flex-row gap-2">
          {todoProject ? (
            <div className="flex flex-row gap-2 items-center">
              <span>{todoProject.name}</span>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handleDeleteFromProject}
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
                disabled={selectedProjectId === null}
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
      </div>
    </li>
  );
};

export default TodoListItem;
