"use client";

import { useCallback, useEffect, useState } from "react";
import HabitListItem from "./HabitListItem";
import { Habit } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { ExtendedHabit } from "@/types/Entitities";
import { useFetchArchivedHabits, useFetchHabits } from "@/queries/habitQueries";
import { Separator } from "../ui/separator";
import ArchivedHabitListItem from "./ArchivedHabitListItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/Buttons/button";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

const HabitList = () => {
  const [isArcihivedOpen, setIsArcihivedOpen] = useState(false);

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
    if (habits && habits.length > 0) {
      const sorted = sortArrayOfObjectsByKey<ExtendedHabit>(
        habits,
        "name",
        "desc"
      );
      setSortedHabits(sorted);
    }
  }, [habits]);

  useEffect(() => {
    if (archivedHabits && archivedHabits.length > 0) {
      const sorted = sortArrayOfObjectsByKey(archivedHabits, "name", "desc");
      setSortedArchivedHabits(sorted);
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
      {/*  Habits Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2"> Habits</h2>
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
        {sortedHabits.length === 0 && !isLoading && (
          <div className="opacity-80 mt-2">No habits found.</div>
        )}

        <ul className="border rounded-sm mt-2">
          {sortedHabits.map((habit) => (
            <HabitListItem key={habit.id} habit={habit} />
          ))}
        </ul>
      </section>

      <Separator className="my-4" />

      {/* Archived Habits Section */}
      <section>
        <Collapsible
          open={isArcihivedOpen}
          onOpenChange={setIsArcihivedOpen}
          className="w-full space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <span>Archived Habits</span>
              <Badge className="ml-2">{sortedArchivedHabits.length}</Badge>
              {isArcihivedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {sortedArchivedHabits.length > 0 ? (
              <>
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
                  <div>
                    Error loading archived habits: {errorArchived.message}
                  </div>
                )}
                <ul className="border rounded-sm mt-2">
                  {sortedArchivedHabits.map((habit) => (
                    <ArchivedHabitListItem key={habit.id} habit={habit} />
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No archived habits found.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  );
};

export default HabitList;
