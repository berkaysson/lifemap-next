"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { Habit } from "@prisma/client";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { HabitContext } from "@/contexts/HabitContext";
import HabitEditForm from "./HabitEditForm";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import HabitProgressesList from "./HabitProgressesList";

const HabitListItem = ({ habit }: { habit: any }) => {
  const { onDeleteHabit } = useContext(HabitContext);
  const [isHabitProgressesCollapsed, setIsHabitProgressesCollapsed] =
    useState(true);

  const category = habit.category;
  const habitProgresses = habit.progress;
  const expired = isExpired(habit.endDate);
  const remained = getRemainingTime(habit.endDate);

  const handleDelete = async () => {
    await onDeleteHabit(habit.id);
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
          {formatDate(habit.startDate)} - {formatDate(habit.endDate)}
        </span>
        <div>
          {expired ? "Expired" : "ends"} {remained}
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
      </div>
      <div>
        <Collapsible
          open={isHabitProgressesCollapsed}
          onOpenChange={setIsHabitProgressesCollapsed}
          className="w-full"
        >
          <div className="flex flex-col space-y-2 mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                Habit Progresses
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <HabitProgressesList
                habitProgresses={habitProgresses}
                categoryName={category?.name}
              />
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </li>
  );
};

export default HabitListItem;
