"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import HabitListItem from "./HabitListItem";
import { HabitContext } from "@/contexts/HabitContext";
import { Habit } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedHabit } from "@/types/Entitities";

const HabitList = () => {
  const { habits } = useContext(HabitContext);
  const [sortedHabits, setSortedHabits] = useState(habits);

  useEffect(() => {
    setSortedHabits(habits);
  }, [habits]);

  const handleSort = useCallback(
    (sortBy: keyof Habit, direction: "asc" | "desc") => {
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
      <ul className="border rounded-sm">
        {sortedHabits.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} />
        ))}
      </ul>
    </div>
  );
};

export default HabitList;
