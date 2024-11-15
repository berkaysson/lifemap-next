"use client";

import { useCallback, useEffect, useState } from "react";
import HabitListItem from "./HabitListItem";
import { Habit } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedHabit } from "@/types/Entitities";
import { useFetchArchivedHabits, useFetchHabits } from "@/queries/habitQueries";
import { Separator } from "../ui/separator";
import ArchivedHabitListItem from "./ArchivedHabitListItem";

const HabitList = () => {
  const { data: habits, isLoading, isError, error } = useFetchHabits();
  const {
    data: archivedHabits,
    isLoading: isLoadingArchived,
    isError: isErrorArchived,
    error: errorArchived,
  } = useFetchArchivedHabits();

  const [sortedHabits, setSortedHabits] = useState<ExtendedHabit[]>(
    habits || []
  );
  const [sortedArchivedHabits, setSortedArchivedHabits] = useState(
    archivedHabits || []
  );

  useEffect(() => {
    if (habits) {
      setSortedHabits(habits);
    }
  }, [habits]);

  useEffect(() => {
    if (archivedHabits) {
      setSortedArchivedHabits(archivedHabits);
    }
  }, [archivedHabits]);

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

  const handleArchiveSort = useCallback(
    (sortBy: keyof Habit, direction: "asc" | "desc") => {
      if (!archivedHabits) return;
      const sorted = sortArrayOfObjectsByKey(archivedHabits, sortBy, direction);
      setSortedArchivedHabits(sorted);
    },
    [archivedHabits]
  );

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* Active Habits Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Active Habits</h2>
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
        {isLoading && <div>Loading habits...</div>}
        {isError && <div>Error loading habits: {error.message}</div>}
        <ul className="border rounded-sm mt-2">
          {sortedHabits.map((habit) => (
            <HabitListItem key={habit.id} habit={habit} />
          ))}
        </ul>
      </section>

      <Separator className="my-4" />

      {/* Archived Habits Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Archived Habits</h2>
        <SelectSort
          options={[
            { value: "name", label: "Name" },
            { value: "completed", label: "Completion" },
            { value: "goalDurationPerPeriod", label: "Goal Activity" },
            { value: "startDate", label: "Start Date" },
            { value: "endDate", label: "Due Date" },
            { value: "period", label: "Period" },
            { value: "bestStreak", label: "Best Streak" },
            { value: "currentStreak", label: "Final Streak" },
            { value: "archivedAt", label: "Archive Date" },
          ]}
          onSelect={handleArchiveSort}
        />
        {isLoadingArchived && <div>Loading archived habits...</div>}
        {isErrorArchived && (
          <div>Error loading archived habits: {errorArchived.message}</div>
        )}
        <ul className="border rounded-sm mt-2">
          {sortedArchivedHabits.map((habit) => (
            <ArchivedHabitListItem key={habit.id} habit={habit} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HabitList;
