import prisma from "@/lib/prisma";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { getActivitiesTotalDurationBetweenDates } from "./activity";
import { removeOneDay } from "@/lib/time";
import { ServiceResponse } from "@/types/ServiceResponse";

export const updateHabitsCompletedDurationByActivityDate = async (
  userId: string,
  categoryId: string,
  activityDate: Date,
  duration: number
) => {
  const endDate = activityDate;
  const habitProgresses = await prisma.habitProgress.findMany({
    where: {
      userId,
      categoryId,
      startDate: { lte: activityDate },
      endDate: { gte: endDate },
    },
  });

  await Promise.all(
    habitProgresses.map((hp) => updateHabitProgress(hp, duration))
  );
};

export const createHabitProgresses = async (habit: Habit) => {
  let currentDate = habit.startDate;
  const progresses: HabitProgress[] = [];
  let order = 1;
  let currentStreak = 0;
  let bestStreak = 0;

  while (currentDate <= habit.endDate) {
    const progress = await calculateProgress(habit, currentDate, order);

    if (progress.completed) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    progresses.push(progress);
    currentDate = addDays(progress.endDate, 1);
    order++;
  }

  try {
    await prisma.habitProgress.createMany({ data: progresses });
    if (currentStreak > 0 || bestStreak > 0) {
      await prisma.habit.update({
        where: { id: habit.id },
        data: { currentStreak, bestStreak },
      });
    }
  } catch (error) {
    throw error;
  }
};

export const updateHabitCompleted = async (habitId: string) => {
  const isHabitCompleted = await calculateIsHabitCompleted(habitId);
  const { currentStreak, bestStreak } = await calculateStreaks(habitId);

  await prisma.habit.update({
    where: { id: habitId },
    data: { completed: isHabitCompleted, currentStreak, bestStreak },
  });
};

export const calculateIsHabitCompleted = async (habitId: string) => {
  const allHabitProgresses = await prisma.habitProgress.findMany({
    where: { habitId },
  });
  const isHabitCompleted = allHabitProgresses.every(
    (progress) => progress.completed
  );

  return isHabitCompleted;
};

const updateHabitProgress = async (
  habitProgress: HabitProgress,
  duration: number
) => {
  const newCompletedDuration = habitProgress.completedDuration + duration;
  const completed = newCompletedDuration >= habitProgress.goalDuration;

  await prisma.habitProgress.update({
    where: { id: habitProgress.id },
    data: { completedDuration: newCompletedDuration, completed },
  });

  await updateHabitCompleted(habitProgress.habitId);
};

const calculateProgress = async (
  habit: Habit,
  currentDate: Date,
  order: number
) => {
  const endDate = getEndDate(habit.period, currentDate);
  const correctedEndDate = removeOneDay(endDate);

  const completedDuration = await getActivitiesTotalDurationBetweenDates(
    habit.userId,
    habit.categoryId,
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

const calculateStreaks = async (habitId: string) => {
  const habitProgresses = await prisma.habitProgress.findMany({
    where: { habitId },
    orderBy: { startDate: "desc" },
  });

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
