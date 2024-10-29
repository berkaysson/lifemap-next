"use client";

import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import TaskEditForm from "./TaskEditForm";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { ExtendedTask } from "@/types/Entitities";
import { ProjectContext } from "@/contexts/ProjectContext";
import ProjectSelect from "../ui/ProjectSelect";
import { TASK_QUERY_KEY, useDeleteTask } from "@/queries/taskQueries";
import { useQueryClient } from "@tanstack/react-query";

const TaskListItem = ({ task }: { task: ExtendedTask }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { mutateAsync: deleteTask } = useDeleteTask();
  const queryClient = useQueryClient();
  const { projects, onAddTaskToProject, onDeleteTaskFromProject } =
    useContext(ProjectContext);

  const taskProject = projects.find((project) => project.id === task.projectId);

  const category = task.category;
  const expired = isExpired(task.endDate);
  const remained = getRemainingTime(task.endDate);

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const handleAddToProject = () => {
    if (selectedProjectId && !taskProject) {
      onAddTaskToProject(task.id, selectedProjectId);
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, task.userId],
      });
    }
  };

  const handleDeleteFromProject = () => {
    if (taskProject) {
      onDeleteTaskFromProject(task.id, taskProject.id);
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, task.userId],
      });
    }
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
      </div>
    </li>
  );
};

export default TaskListItem;
