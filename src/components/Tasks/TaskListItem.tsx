"use client";

import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import TaskEditForm from "./TaskEditForm";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { ExtendedTask } from "@/types/Entitities";
import {
  useFetchProjects,
  useAddTaskToProject,
  useRemoveTaskFromProject,
} from "@/queries/projectQueries";
import {
  TASK_QUERY_KEY,
  useDeleteTask,
  useArchiveTask,
} from "@/queries/taskQueries";
import { useQueryClient } from "@tanstack/react-query";
import ProjectSelect from "../ui/ProjectSelect";

const TaskListItem = ({ task }: { task: ExtendedTask }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutateAsync: archiveTask } = useArchiveTask();
  const queryClient = useQueryClient();
  const { data: projects = [] } = useFetchProjects();
  const addToProjectMutation = useAddTaskToProject();
  const removeFromProjectMutation = useRemoveTaskFromProject();

  const taskProject = projects.find((project) => project.id === task.projectId);

  const category = task.category;
  const expired = isExpired(task.endDate);
  const remained = getRemainingTime(task.endDate);

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const handleAddToProject = async () => {
    if (selectedProjectId && !taskProject) {
      await addToProjectMutation.mutateAsync({
        entityId: task.id,
        projectId: selectedProjectId,
      });
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, task.userId],
      });
    }
  };

  const handleDeleteFromProject = async () => {
    if (taskProject) {
      await removeFromProjectMutation.mutateAsync({
        entityId: task.id,
        projectId: taskProject.id,
      });
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, task.userId],
      });
    }
  };

  const handleArchive = async () => {
    await archiveTask(task.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <IsCompleted isCompleted={task.completed} isExpired={expired} />
        <ColorCircle colorCode={task.colorCode || "darkblue"} />
        <span>{task.name}</span>
        <span>{task.description}</span>
        <span>{category?.name}</span>
      </div>
      <div>
        <div>
          {task.completedDuration}/{task.goalDuration}
        </div>
        <span>
          {formatDate(task.startDate)} - {formatDate(task.endDate)}
        </span>
        <div>
          {expired ? "Expired" : "ends"} {remained}
        </div>
        <div className="flex flex-row gap-2">
          {taskProject ? (
            <div className="flex flex-row gap-2 items-center">
              <span>{taskProject.name}</span>
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
        <TaskEditForm
          initialValues={task}
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

export default TaskListItem;
