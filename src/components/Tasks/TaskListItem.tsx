"use client";

import { formatDateFriendly, getRemainingTime, isExpired } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import TaskEditForm from "./TaskEditForm";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { ExtendedTask } from "@/types/Entitities";
import { useFetchProjects } from "@/queries/projectQueries";
import { useDeleteTask, useArchiveTask } from "@/queries/taskQueries";
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
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutateAsync: archiveTask } = useArchiveTask();
  const { data: projects = [] } = useFetchProjects();

  const taskProject = projects.find((project) => project.id === task.projectId);

  const category = task.category;
  const expired = isExpired(task.endDate);
  const remained = getRemainingTime(task.endDate);

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const handleArchive = async () => {
    await archiveTask(task.id);
  };

  const progressPercentage = (task.completedDuration / task.goalDuration) * 100;

  return (
    <Card className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between p-1 pb-0 items-start sm:flex-row flex-col gap-1">
        <div className="flex gap-1 sm:gap-2 sm:justify-start sm:w-auto w-full justify-between">
          <ColorCircle colorCode={task.colorCode || "darkblue"} />
          <IsCompleted isCompleted={task.completed} isExpired={expired} />
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Badge tooltipText="Category">
            <Iconify
              icon="solar:hashtag-square-linear"
              width={16}
              className="mr-1"
            />
            {category?.name}
          </Badge>
          <Badge
            tooltipText="Project"
            variant="outline"
            style={{ backgroundColor: task.colorCode || "darkblue" }}
            className="text-white"
          >
            <Iconify
              icon="solar:folder-with-files-bold"
              width={16}
              className="mr-1"
            />
            {taskProject ? taskProject.name : "No Project"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-1">
        <h3 className="text-lg font-semibold">{task.name}</h3>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <CardDescription>{task.description}</CardDescription>
        <div className="flex justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-4 mt-1">
          <div className="flex items-center space-x-2 text-shade">
            <Iconify
              icon="solar:calendar-date-bold"
              width={20}
              className="mr-1"
            />
            <span className="text-sm">
              {formatDateFriendly(task.startDate)} -{" "}
              {formatDateFriendly(task.endDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-shade">
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
              <Iconify
                icon="solar:pen-new-square-bold-duotone"
                width={16}
                className="mr-1"
              />
              Edit
            </Button>
          }
        />
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText=""
          icon="solar:trash-bin-trash-bold"
          onConfirm={handleDelete}
        />
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText=""
          icon="solar:archive-bold"
          onConfirm={handleArchive}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskListItem;
