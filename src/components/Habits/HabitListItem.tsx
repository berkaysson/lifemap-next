"use client";

import { formatDateFriendly, getRemainingTime, isExpired } from "@/lib/time";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import HabitProgressesList from "./HabitProgressesList";
import { ExtendedHabit } from "@/types/Entitities";
import { useFetchProjects } from "@/queries/projectQueries";
import { useDeleteHabit, useArchiveHabit } from "@/queries/habitQueries";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import HabitProjectEdit from "./HabitProjectEdit";
import { Button } from "../ui/Buttons/button";

const HabitListItem = ({
  habit,
  mode = "normal",
}: {
  habit: ExtendedHabit | any;
  mode?: "normal" | "light";
}) => {
  const { mutateAsync: deleteHabit } = useDeleteHabit();
  const { mutateAsync: archiveHabit } = useArchiveHabit();
  const { data: projects = [] } = useFetchProjects();

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

  const handleArchive = async () => {
    await archiveHabit(habit.id);
  };

  return (
    <Card className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between p-1 pb-0 items-start sm:flex-row flex-col gap-1">
        <div className="flex gap-1 sm:gap-2 sm:justify-start sm:w-auto w-full justify-between">
          <ColorCircle colorCode={habit.colorCode || "darkblue"} />
          <IsCompleted isCompleted={habit.completed} isExpired={expired} />
        </div>

        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <Badge tooltipText="Activity Type">
            <Iconify
              icon="solar:hashtag-square-linear"
              width={16}
              className="mr-1"
            />
            {category?.name}
          </Badge>
          {habitProject && (
            <Badge
              tooltipText="Project"
              variant="outline"
              style={{ backgroundColor: habit.colorCode || "darkblue" }}
              className="text-white"
            >
              <Iconify
                icon="solar:folder-with-files-bold"
                width={16}
                className="mr-1"
              />
              {habitProject.name}
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-1">
        <h3 className="text-lg font-semibold">{habit.name}</h3>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        {mode === "normal" && (
          <CardDescription>{habit.description}</CardDescription>
        )}

        <div className="flex justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1 mt-1">
          <div className="flex items-center space-x-2 text-shade">
            <Iconify
              icon="solar:calendar-date-bold"
              width={20}
              className="mr-2"
            />
            <span className="text-sm">
              {formatDateFriendly(habit.startDate)} -{" "}
              {formatDateFriendly(habit.endDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-shade">
            <Iconify icon="solar:stopwatch-bold" width={20} className="mr-2" />
            <span className="text-sm">
              {expired ? "Expired" : "Ends"} {remained}
            </span>
          </div>
        </div>
        {mode === "normal" && (
          <div className="flex items-center space-x-2 text-shade mb-3">
            <Iconify icon="solar:fire-bold" width={20} className="mr-2" />
            <span className="text-sm">Best Streak: {habit.bestStreak}</span>
          </div>
        )}

        {mode === "normal" && (
          <div className="flex justify-end space-x-2">
            {/* <HabitEditForm
              initialValues={habit}
              triggerButton={
                <Button variant={"outline"} size={"sm"}>
                  <Iconify
                    icon="solar:pen-new-square-bold-duotone"
                    width={16}
                    className="mr-1"
                  />
                  Edit
                </Button>
              }
            /> */}
            <HabitProjectEdit
              habit={habit}
              triggerButton={
                <Button size={"sm"} variant={"outline"}>
                  <Iconify
                    icon="solar:folder-open-bold"
                    width={16}
                    className="mr-1"
                  />
                  Project
                </Button>
              }
            />
            <ButtonWithConfirmation
              variant="destructive"
              size={"sm"}
              buttonText={""}
              icon="solar:trash-bin-trash-bold"
              onConfirm={handleDelete}
            />
            <ButtonWithConfirmation
              variant="destructive"
              size={"sm"}
              buttonText={""}
              icon="solar:archive-bold"
              onConfirm={handleArchive}
            />
          </div>
        )}
      </CardContent>

      <div className="px-2 sm:px-3 pb-1">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={habit.id}
        >
          <AccordionItem value={habit.id}>
            <AccordionTrigger className="hover:opacity-80 hover:no-underline transition-colors underline">
              Habit Steps
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                <HabitProgressesList
                  habitProgresses={habitProgresses}
                  period={habit.period}
                  colorCode={habit.colorCode || "darkblue"}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default HabitListItem;
