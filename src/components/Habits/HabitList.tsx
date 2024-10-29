"use client";

import { useCallback, useEffect, useState } from "react";
import HabitListItem from "./HabitListItem";
import { Habit } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedHabit } from "@/types/Entitities";
import { useFetchHabits } from "@/queries/habitQueries";

const HabitList = () => {
  const { data: habits, isLoading, isError, error } = useFetchHabits();
  const [sortedHabits, setSortedHabits] = useState(habits || []);

  useEffect(() => {
    if (habits) {
      setSortedHabits(habits);
    }
  }, [habits]);

  const handleSort = useCallback(
    (sortBy: keyof Habit, direction: "asc" | "desc") => {
      if (!habits) return;
      const sorted = sortArrayOfObjectsByKey<ExtendedHabit>(
        habits,
        sortBy,
        direction
      );
      setSortedHabits(sorted);
    },
    [habits]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
          { value: "completed", label: "Completion" },
          { value: "goalDurationPerPeriod", label: "Goal Activity" },
          { value: "startDate", label: "Start Date" },
          { value: "endDate", label: "Due Date" },
          { value: "category", label: "Category" },
          { value: "period", label: "Period" },
          { value: "currentStreak", label: "Current Streak" },
          { value: "bestStreak", label: "Longest Streak" },
        ]}
        onSelect={handleSort}
      />
      {isLoading && <div>Loading categories...</div>}
      {isError && <div>Error loading categories: {error.message}</div>}
      <ul className="border rounded-sm">
        {sortedHabits.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} />
        ))}
      </ul>
    </div>
  );
};

export default HabitList;
