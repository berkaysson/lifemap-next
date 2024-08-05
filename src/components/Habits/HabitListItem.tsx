"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { Habit } from "@prisma/client";
import { useContext } from "react";
import { Button } from "../ui/button";
import { HabitContext } from "@/contexts/HabitContext";
import HabitEditForm from "./HabitEditForm";
import IsCompleted from "../ui/IsCompleted";
import ColorCircle from "../ui/ColorCircle";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";

const HabitListItem = ({ habit }: { habit: Habit }) => {
  const { categories } = useContext(CategoryContext);
  const { onDeleteHabit } = useContext(HabitContext);

  const category = categories.find((c) => c.id === habit.categoryId);
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
        <div>
          habit progress component
        </div>
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
    </li>
  );
};

export default HabitListItem;
