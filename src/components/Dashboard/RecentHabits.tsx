"use client";

import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchHabits } from "@/queries/habitQueries";
import HabitListItem from "../Habits/HabitListItem";

const RecentHabits = () => {
  const { data: habits = [] } = useFetchHabits();

  const sortedHabits = habits.sort((a, b) => {
    const aIsToday = a.endDate && isToday(new Date(a.endDate));
    const bIsToday = b.endDate && isToday(new Date(b.endDate));

    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const recentHabit = sortedHabits[0];

  return (
    <div className="space-y-2">
      {recentHabit && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Habit</h2>
            <Button asChild size="sm" variant="link" className="w-auto">
              <Link href={"/dashboard/habit"}>All Habits</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <HabitListItem key={recentHabit.id} habit={recentHabit} mode="light" />
          </div>
        </>
      )}
    </div>
  );
};

export default RecentHabits;
