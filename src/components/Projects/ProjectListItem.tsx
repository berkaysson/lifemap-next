"use client";

import {
  useDeleteProject,
  useRemoveToDoFromProject,
  useRemoveTaskFromProject,
  useRemoveHabitFromProject,
} from "@/queries/projectQueries";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { ExtendedProject } from "@/types/Entitities";
import ProjectEditForm from "./ProjectEditForm";
import { Button } from "../ui/Buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";

const ProjectListItem = ({ project }: { project: ExtendedProject }) => {
  const deleteProjectMutation = useDeleteProject();
  const removeToDoMutation = useRemoveToDoFromProject();
  const removeTaskMutation = useRemoveTaskFromProject();
  const removeHabitMutation = useRemoveHabitFromProject();

  const [isToDoOpen, setIsToDoOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isHabitOpen, setIsHabitOpen] = useState(false);

  const handleDelete = async () => {
    await deleteProjectMutation.mutateAsync(project.id);
  };

  const { todos: _, tasks: __, habits: ___, ...projectOnly } = project;
  const initialValues = { ...projectOnly };

  return (
    <Card className="w-full mx-auto mb-6">
      <CardHeader>
        <CardTitle>
          <Badge tooltipText="Project" className="text-lg">
            <Iconify
              icon="solar:folder-with-files-bold"
              width={16}
              className="mr-1"
            />
            {project.name}
          </Badge>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Collapsible open={isToDoOpen} onOpenChange={setIsToDoOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Iconify
                  icon="solar:checklist-minimalistic-outline"
                  width={16}
                  className="mr-2"
                />
                ToDos
              </span>
              <Badge>{project.todos.length}</Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="space-y-2">
              {project.todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{todo.name}</span>
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      removeToDoMutation.mutate({
                        entityId: todo.id,
                        projectId: project.id,
                      })
                    }
                    isLoading={removeToDoMutation.isPending}
                    loadingText="Removing"
                  >
                    <Iconify
                      icon="solar:remove-folder-bold"
                      width={16}
                      className="mr-1"
                    />
                    Remove
                  </LoadingButton>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isTaskOpen} onOpenChange={setIsTaskOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Iconify
                  icon="solar:check-read-outline"
                  width={16}
                  className="mr-2"
                />
                Tasks
              </span>
              <Badge>{project.tasks.length}</Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="space-y-2">
              {project.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{task.name}</span>
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      removeTaskMutation.mutate({
                        entityId: task.id,
                        projectId: project.id,
                      })
                    }
                    isLoading={removeTaskMutation.isPending}
                    loadingText="Removing"
                  >
                    <Iconify
                      icon="solar:remove-folder-bold"
                      width={16}
                      className="mr-1"
                    />
                    Remove
                  </LoadingButton>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isHabitOpen} onOpenChange={setIsHabitOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Iconify icon="ph:plant-light" width={16} className="mr-2" />
                Habits
              </span>
              <Badge>{project.habits.length}</Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="space-y-2">
              {project.habits.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{habit.name}</span>
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      removeHabitMutation.mutate({
                        entityId: habit.id,
                        projectId: project.id,
                      })
                    }
                    isLoading={removeHabitMutation.isPending}
                    loadingText="Removing"
                  >
                    <Iconify
                      icon="solar:remove-folder-bold"
                      width={16}
                      className="mr-1"
                    />
                    Remove
                  </LoadingButton>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText="Delete"
          icon="solar:trash-bin-trash-bold"
          onConfirm={handleDelete}
        />
        <ProjectEditForm
          initialValues={initialValues}
          triggerButton={
            <Button variant="outline" size="sm">
              <Iconify
                icon="solar:pen-new-square-outline"
                width={16}
                className="mr-1"
              />
              Edit
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
};

export default ProjectListItem;
