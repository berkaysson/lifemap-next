"use client";

import { formatDateFriendly, getRemainingTime, isExpired } from "@/lib/time";
import { useState } from "react";
import { Button } from "../ui/Buttons/button";
import HabitEditForm from "./HabitEditForm";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { ChevronsUpDown } from "lucide-react";
import HabitProgressesList from "./HabitProgressesList";
import { ExtendedHabit } from "@/types/Entitities";
import {
  useFetchProjects,
  useAddHabitToProject,
  useRemoveHabitFromProject,
} from "@/queries/projectQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  HABIT_QUERY_KEY,
  useDeleteHabit,
  useArchiveHabit,
} from "@/queries/habitQueries";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

const HabitListItem = ({ habit }: { habit: ExtendedHabit }) => {
  const [isHabitProgressesCollapsed, setIsHabitProgressesCollapsed] =
    useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { mutateAsync: deleteHabit } = useDeleteHabit();
  const { mutateAsync: archiveHabit } = useArchiveHabit();
  const queryClient = useQueryClient();
  const { data: projects = [] } = useFetchProjects();
  const addToProjectMutation = useAddHabitToProject();
  const removeFromProjectMutation = useRemoveHabitFromProject();

  const habitProject = projects.find(
    (project) => project.id === habit.projectId
  );

  const category = habit.category;
  const habitProgresses = habit.progress;
  const expired = isExpired(habit.endDate);
  const remained = getRemainingTime(habit.endDate);

  const handleDelete = async () => {
    await deleteHabit(habit.id);
  };

  const handleAddToProject = async () => {
    if (selectedProjectId && !habitProject) {
      await addToProjectMutation.mutateAsync({
        entityId: habit.id,
        projectId: selectedProjectId,
      });
      queryClient.invalidateQueries({
        queryKey: [HABIT_QUERY_KEY, habit.userId],
      });
    }
  };

  const handleDeleteFromProject = async () => {
    if (habitProject) {
      await removeFromProjectMutation.mutateAsync({
        entityId: habit.id,
        projectId: habitProject.id,
      });
      queryClient.invalidateQueries({
        queryKey: [HABIT_QUERY_KEY, habit.userId],
      });
    }
  };

  const handleArchive = async () => {
    await archiveHabit(habit.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <IsCompleted isCompleted={habit.completed} isExpired={expired} />
        <ColorCircle colorCode={habit.colorCode || "darkblue"} />
        <span>{habit.name}</span>
        <span>{habit.description}</span>
        <span>{category?.name}</span>
      </div>
      <div>
        <span>
          {formatDateFriendly(habit.startDate)} -{" "}
          {formatDateFriendly(habit.endDate)}
        </span>
        <div>
          {expired ? "Expired" : "ends"} {remained}
        </div>
        <div className="flex flex-row gap-2">
          {habitProject ? (
            <div className="flex flex-row gap-2 items-center">
              <span>{habitProject.name}</span>
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
        <HabitEditForm
          initialValues={habit}
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
      <div>
        <div>Best Streak: {habit.bestStreak} days</div>
        <div>Current Streak: {habit.currentStreak} days</div>
      </div>
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="habit-progresses">
            <AccordionTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setIsHabitProgressesCollapsed(!isHabitProgressesCollapsed)
                }
              >
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                Habit Progresses
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                <HabitProgressesList
                  habitProgresses={habitProgresses}
                  categoryName={category?.name}
                  period={habit.period}
                  colorCode={habit.colorCode || "darkblue"}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </li>
  );
};

export default HabitListItem;
