"use client";

import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchHabits } from "@/queries/habitQueries";
import HabitListItem from "../Habits/HabitListItem";
import { useState } from "react";
import { Iconify } from "../ui/iconify";

const RecentHabits = () => {
  const { data: habits = [] } = useFetchHabits();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedHabits = habits.sort((a, b) => {
    const aIsToday = a.endDate && isToday(new Date(a.endDate));
    const bIsToday = b.endDate && isToday(new Date(b.endDate));

    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedHabits.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedHabits.length - 1 : prev - 1
    );
  };

  const currentHabit = sortedHabits[currentIndex];

  return (
    <>
      {currentHabit && (
        <div className="space-y-2 px-2 sm:px-4">
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Habit</h2>
              <Button asChild size="sm" variant="link" className="w-auto">
                <Link href={"/dashboard/habit"}>All Habits</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1">
              <HabitListItem
                key={currentHabit.id}
                habit={currentHabit}
                mode="light"
              />

              <div className="flex justify-between">
                <Button
                  size={"icon"}
                  className="h-8 w-8"
                  onClick={handlePrev}
                  variant="outline"
                >
                  <Iconify icon="solar:alt-arrow-left-bold" width={16} />
                  <span className="sr-only">Previous</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {sortedHabits.length} habit
                </span>
                <Button
                  size={"icon"}
                  onClick={handleNext}
                  variant="outline"
                  className="h-8 w-8"
                >
                  <Iconify icon="solar:alt-arrow-right-bold" width={16} />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default RecentHabits;
