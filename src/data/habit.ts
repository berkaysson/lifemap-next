import prisma from "@/lib/prisma";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays, addMonths, addWeeks } from "date-fns";
import { getActivitiesTotalDurationBetweenDates } from "./activity";
import { removeOneDay } from "@/lib/time";

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

  while (currentDate <= habit.endDate) {
    const progress = await calculateProgress(habit, currentDate, order);
    progresses.push(progress);
    currentDate = addDays(progress.endDate, 1);
    order++;
  }

  try {
    await prisma.habitProgress.createMany({ data: progresses });
  } catch (error) {
    throw error;
  }
};

export const updateHabitCompleted = async (habitId: string) => {
  const isHabitCompleted = await calculateIsHabitCompleted(habitId);
  await prisma.habit.update({
    where: { id: habitId },
    data: { completed: isHabitCompleted },
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

const calculateProgress = async (habit: Habit, currentDate: Date, order: number) => {
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

const getEndDate = (period: string, date: Date) => {
  switch (period) {
    case "DAILY": return addDays(date, 1);
    case "WEEKLY": return addWeeks(date, 1);
    case "MONTHLY": return addMonths(date, 1);
    default: return date;
  }
};