"use server";

import prisma from "@/lib/prisma";
import {
  calculateEndDateWithPeriod,
  checkStartDateAvailability,
  parseDate,
} from "@/lib/time";
import { HabitSchema } from "@/schema";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays, addMonths, addWeeks } from "date-fns";
import { z } from "zod";

export const createHabit = async (
  newHabit: z.infer<typeof HabitSchema>,
  userId: string
) => {
  const validatedFields = HabitSchema.safeParse(newHabit);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields!",
      success: false,
    };
  }

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      id: newHabit.categoryId,
      userId,
    },
  });

  if (!isCategoryExist) {
    return {
      message: "Category does not exist",
      success: false,
    };
  }

  const startDate = parseDate(newHabit.startDate);
  const endDate = calculateEndDateWithPeriod(
    startDate,
    newHabit.period,
    newHabit.numberOfPeriods
  );

  if (!checkStartDateAvailability(startDate, endDate)) {
    return {
      message: "Start date cannot be greater than due date",
      success: false,
    };
  }

  try {
    const createdHabit = await prisma.habit.create({
      data: {
        name: newHabit.name,
        description: newHabit.description || undefined,
        colorCode: newHabit.colorCode || "#000000",
        period: newHabit.period,
        startDate,
        endDate,
        goalDurationPerPeriod: newHabit.goalDurationPerPeriod,
        userId,
        categoryId: newHabit.categoryId,
        projectId: newHabit.projectId || undefined,
        completed: false,
        currentStreak: 0,
        bestStreak: 0,
        numberOfPeriods: newHabit.numberOfPeriods,
      },
    });

    const habitProgresses = await generateHabitProgresses(
      createdHabit,
    );

    await prisma.habitProgress.createMany({
      data: habitProgresses,
    });

    return {
      message: "Successfully created habit",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to create habit: ${error}`,
      success: false,
    };
  }
};

export const getHabits = async (userId: string) => {
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });
    return {
      message: "Successfully fetched habits",
      success: true,
      habits,
    };
  } catch (error) {
    return {
      message: `Failed to fetch habits: ${error}`,
      success: false,
    };
  }
};

const generateHabitProgresses = async (
  habit: Habit
) => {
  const progresses: HabitProgress[] = [];
  let currentDate = habit.startDate;
  let progressEndDate = currentDate;
  let order = 1;

  while (progressEndDate < habit.endDate) {
    switch (habit.period) {
      case "DAILY":
        progressEndDate = addDays(currentDate, 1);
        break;
      case "WEEKLY":
        progressEndDate = addWeeks(currentDate, 1);
        break;
      case "MONTHLY":
        progressEndDate = addMonths(currentDate, 1);
        break;
    }

    const completedDuration = await calculateHabitProgressCompletedDuration(
      habit,
      currentDate,
      progressEndDate
    );
    const completed = await calculateHabitProgressCompletion(
      completedDuration,
      habit.goalDurationPerPeriod
    );

    const habitId = habit.id;
    const userId = habit.userId;
    const categoryId = habit.categoryId;
    const goalDuration = habit.goalDurationPerPeriod;

    progresses.push({
      order,
      startDate: new Date(currentDate),
      endDate: new Date(progressEndDate),
      completedDuration,
      completed,
      habitId,
      userId,
      categoryId,
      goalDuration,
    } as HabitProgress);

    currentDate = progressEndDate;
    order++;
  }

  return progresses;
};

export const calculateHabitProgressCompletedDuration = async (
  habit: Habit,
  startDate: Date,
  endDate: Date
) => {
  const activities = await prisma.activity.findMany({
    where: {
      userId: habit.userId,
      categoryId: habit.categoryId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (activities.length === 0) {
    return 0;
  }

  const totalDuration = activities
    .map((activity) => activity.duration)
    .reduce((total, duration) => total + duration, 0);

  return totalDuration;
};

export const calculateHabitProgressCompletion = async (
  completedDuration: number,
  goalDurationPerPeriod: number
) => {
  const isCompleted = completedDuration >= goalDurationPerPeriod;
  return isCompleted;
};
