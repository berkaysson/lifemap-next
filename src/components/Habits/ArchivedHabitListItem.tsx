"use client";

import { isExpired } from "@/lib/time";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { useDeleteArchivedHabit } from "@/queries/habitQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { lazy, Suspense, useState } from "react";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";

const LazyHabitForm = lazy(() => import("./HabitForm"));

const ArchivedHabitListItem = ({ habit }) => {
  const expired = isExpired(habit.endDate);
  const deleteArchivedHabit = useDeleteArchivedHabit();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = () => {
    deleteArchivedHabit.mutate(habit.id);
  };

  return (
    <Card className="w-full mb-1 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-1 items-center p-1 pb-0">
        <ColorCircle colorCode={habit.colorCode || "darkblue"} />
        <IsCompleted isCompleted={habit.completed} isExpired={expired} />
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{habit.name}</h3>
      </CardHeader>
      <CardContent className="flex">
        <div className="flex flex-col gap-1">
          <CardDescription>
            {habit.description && <div>{habit.description}</div>}
          </CardDescription>

          <div className="text-sm text-shade">
            <div>Start: {habit.startDate.toLocaleDateString()}</div>
            <div>Due: {habit.endDate.toLocaleDateString()}</div>
            <div>Archived: {habit.archivedAt.toLocaleDateString()}</div>
            <div>Activity Type: {habit.categoryName}</div>
            <div>Period: {habit.period}</div>
            <div>Best Streak: {habit.bestStreak} days</div>
          </div>
          {habit.project && (
            <div className="text-sm">
              Project: <span className="font-medium">{habit.project.name}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 flex-wrap">
        <ButtonWithConfirmation
          buttonText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
          icon="solar:trash-bin-trash-bold"
        />
        <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
          <Iconify icon="solar:archive-up-bold" width={20} />
          Recreate
        </Button>
      </CardFooter>
      {isFormOpen && (
        <Suspense fallback={null}>
          <LazyHabitForm
            useArea="archive"
            defaultValues={{
              name: habit.name,
              description: habit.description || "",
              period: habit.period,
              startDate: habit.startDate.toISOString().split("T")[0],
              numberOfPeriods: 2,
              goalDurationPerPeriod: habit.goalDurationPerPeriod,
              categoryId: habit.categoryId,
              colorCode: habit.colorCode,
            }}
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
          />
        </Suspense>
      )}
    </Card>
  );
};

export default ArchivedHabitListItem;
