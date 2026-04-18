import { useFetchHabitProgressesEndingInDays } from "@/queries/habitQueries";
import { HabitProgress, Habit, Category, Period } from "@prisma/client";
import { useMemo } from "react";

export interface GroupedHabitProgress extends HabitProgress {
  habit: Habit & { category: Category };
  occurrenceCount: number;
}

/**
 * Hook to fetch and group habit progresses ending within a specified number of days.
 * Specifically groups DAILY habits by habitId and adds an occurrenceCount.
 */
export const useFetchUpcomingHabits = (days: number = 7) => {
  const { data: progresses, isLoading } = useFetchHabitProgressesEndingInDays(days);

  const processedData = useMemo(() => {
    if (!progresses) return { dailyHabits: [], otherHabits: [], allGrouped: [] };

    const dailyGroups: Record<string, GroupedHabitProgress> = {};
    const otherHabits: any[] = [];

    progresses.forEach((progress: any) => {
      if (progress.completed) return; // Skip if goal reached

      const isDaily = progress.habit.period === Period.DAILY;

      if (isDaily) {
        // Only count uncompleted ones if we want to show "remaining" tasks?
        // Or count all that are in the items list. 
        // Based on "how much of them exist in items", we count all that returned from query.
        if (!dailyGroups[progress.habitId]) {
          dailyGroups[progress.habitId] = {
            ...progress,
            occurrenceCount: 1,
          };
        } else {
          dailyGroups[progress.habitId].occurrenceCount++;
          
          // Optionally: Keep the earliest endDate to show the next upcoming deadline
          const currentEndDate = new Date(progress.endDate);
          const storedEndDate = new Date(dailyGroups[progress.habitId].endDate);
          
          if (currentEndDate < storedEndDate) {
            dailyGroups[progress.habitId].endDate = progress.endDate;
            dailyGroups[progress.habitId].id = progress.id;
          }
        }
      } else {
        otherHabits.push({
          ...progress,
          occurrenceCount: 1, // Non-daily usually occur once in a short window
        });
      }
    });

    const dailyHabits = Object.values(dailyGroups);
    
    return {
      dailyHabits,
      otherHabits,
      allGrouped: [...dailyHabits, ...otherHabits].sort((a, b) => 
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      ),
    };
  }, [progresses]);

  return {
    ...processedData,
    isLoading,
  };
};
