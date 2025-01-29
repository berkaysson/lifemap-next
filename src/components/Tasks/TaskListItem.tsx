"use client";

import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { useContext, useState } from "react";
import { Button } from "../ui/Buttons/button";
import TaskEditForm from "./TaskEditForm";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
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
import ProjectSelect from "../ui/Shared/ProjectSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import { Progress } from "../ui/progress";

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

  const progressPercentage = (task.completedDuration / task.goalDuration) * 100;

  return (
    <Card className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between p-1 pb-0">
        <div className="flex gap-2 items-center">
          <ColorCircle colorCode={task.colorCode || "darkblue"} />
          <IsCompleted isCompleted={task.completed} isExpired={expired} />
        </div>

        <div className="flex gap-2">
          <Badge>{category?.name}</Badge>
          <Badge
            variant="outline"
            style={{ backgroundColor: task.colorCode || "darkblue" }}
            className="text-white"
          >
            {taskProject ? taskProject.name : "No Project"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{task.name}</h3>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
        <div className="flex flex-row justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Iconify
              icon="solar:calendar-date-bold"
              width={20}
              className="mr-2"
            />
            <span className="text-sm">
              {formatDate(task.startDate)} - {formatDate(task.endDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Iconify icon="solar:stopwatch-bold" width={20} className="mr-2" />
            <span className="text-sm">
              {expired ? "Expired" : "Ends"} {remained}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {task.completedDuration}/{task.goalDuration} minutes
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <TaskEditForm
          initialValues={task}
          triggerButton={
            <Button variant="outline" size="sm">
              Edit
            </Button>
          }
        />
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText="Delete"
          onConfirm={handleDelete}
        />
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText="Archive"
          onConfirm={handleArchive}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskListItem;
