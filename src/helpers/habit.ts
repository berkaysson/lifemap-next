import prisma from "@/lib/prisma";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { removeOneDay } from "@/lib/time";
import { ServiceResponse } from "@/types/ServiceResponse";

export const updateHabitsCompletedDurationByActivityDate = async (
  userId: string,
  categoryId: string,
  activityDate: Date,
  duration: number
) => {
  const endDate = activityDate;

  // Fetch habit progress for the given date range
  const habitProgresses = await prisma.habitProgress.findMany({
    where: {
      userId,
      categoryId,
      startDate: { lte: activityDate },
      endDate: { gte: endDate },
    },
    include: { habit: true },
  });

  // Batch update for habit progresses
  const habitProgressUpdates = habitProgresses.map((habitProgress) => {
    const newCompletedDuration = habitProgress.completedDuration + duration;
    const completed = newCompletedDuration >= habitProgress.goalDuration;
    return prisma.habitProgress.update({
      where: { id: habitProgress.id },
      data: { completedDuration: newCompletedDuration, completed },
    });
  });

  // Await all updates in parallel
  await Promise.all(habitProgressUpdates);

  // Update the habits after all progress updates
  const habitIds = habitProgresses.map((hp) => hp.habitId);
  const habitCompletionUpdates = habitIds.map((habitId) =>
    updateHabitCompleted(habitId)
  );

  await Promise.all(habitCompletionUpdates);
};

export const updateHabitCompleted = async (habitId: string) => {
  const habitProgresses = await prisma.habitProgress.findMany({
    where: { habitId },
  });
  const isHabitCompleted = await calculateIsHabitCompleted(habitProgresses);
  const { currentStreak, bestStreak } = await calculateStreaks(habitProgresses);

  await prisma.habit.update({
    where: { id: habitId },
    data: { completed: isHabitCompleted, currentStreak, bestStreak },
  });
};

export const calculateIsHabitCompleted = async (
  habitProgresses: HabitProgress[]
) => {
  const isHabitCompleted = habitProgresses.every(
    (progress) => progress.completed
  );

  return isHabitCompleted;
};

export const calculateProgress = async (
  habit: Habit,
  currentDate: Date,
  order: number,
  activities: { date: Date; duration: number }[]
) => {
  const endDate = getEndDate(habit.period, currentDate);
  const correctedEndDate = removeOneDay(endDate);

  const completedDuration = calculateTotalDurationForDateRange(
    activities,
    currentDate,
    correctedEndDate
  );
  const completed = completedDuration >= habit.goalDurationPerPeriod;

  return {
    order: order,
    startDate: currentDate,
    endDate: correctedEndDate,
    completedDuration,
    completed,
    habitId: habit.id,
    userId: habit.userId,
    categoryId: habit.categoryId,
    goalDuration: habit.goalDurationPerPeriod,
  } as HabitProgress;
};

const calculateTotalDurationForDateRange = (
  activities: { date: Date; duration: number }[],
  startDate: Date,
  endDate: Date
): number => {
  return activities
    .filter(
      (activity) => activity.date >= startDate && activity.date <= endDate
    )
    .reduce((total, activity) => total + activity.duration, 0);
};

const calculateStreaks = async (habitProgresses: HabitProgress[]) => {
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak, streak should contain today

  for (const progress of habitProgresses) {
    if (progress.completed) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, bestStreak };
};

const getEndDate = (period: string, date: Date) => {
  switch (period) {
    case "DAILY":
      return addDays(date, 1);
    case "WEEKLY":
      return addWeeks(date, 1);
    case "MONTHLY":
      return addMonths(date, 1);
    default:
      return date;
  }
};

export const validateHabitPeriodAndDate = (
  numberOfPeriods: number,
  startDate: Date,
  endDate: Date
): ServiceResponse => {
  if (numberOfPeriods < 2) {
    return {
      message:
        "Number of periods must be at least 2. If you want to create a one-period habit, you should create a Task.",
      success: false,
    };
  }

  if (numberOfPeriods > 90) {
    return {
      message: "Number of periods cannot exceed 90.",
      success: false,
    };
  }

  const maxEndDate = addYears(startDate, 1);
  if (endDate > maxEndDate) {
    return {
      message: `End date cannot be more than 1 year from the start date.`,
      success: false,
    };
  }

  return {
    message: "Habit creation is valid.",
    success: true,
  };
};
