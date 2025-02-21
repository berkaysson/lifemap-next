"use server";

import {
  calculateProgress,
  validateHabitPeriodAndDate,
} from "@/helpers/habit";
import prisma from "@/lib/prisma";
import {
  calculateEndDateWithPeriod,
  checkIsStartDateBeforeEndDate,
  parseDate,
  removeOneDay,
} from "@/lib/time";
import { logService } from "@/lib/utils";
import { HabitSchema } from "@/schema";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";

export const createHabit = async (
  newHabit: z.infer<typeof HabitSchema>,
  userId: string
) => {
  logService("createHabit");
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
      message: "Activity Type does not exist",
      success: false,
    };
  }

  const startDate = parseDate(newHabit.startDate);
  const endDate = removeOneDay(
    calculateEndDateWithPeriod(
      startDate,
      newHabit.period,
      newHabit.numberOfPeriods
    )
  );

  if (!checkIsStartDateBeforeEndDate(startDate, endDate)) {
    return {
      message: "Start date cannot be greater than due date",
      success: false,
    };
  }

  const validatedPeriodAndDate = validateHabitPeriodAndDate(
    newHabit.numberOfPeriods,
    startDate,
    endDate
  );

  if (!validatedPeriodAndDate.success) {
    return validatedPeriodAndDate;
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

    const createdHabitProgresses = await createHabitProgresses(createdHabit);
    if (createdHabitProgresses.length === 0) {
      return {
        message: "Failed to create habit progresses",
        success: false,
      };
    }

    const isHabitCompleted = createdHabitProgresses.every(
      (progress) => progress.completed
    );

    if (isHabitCompleted) {
      await prisma.habit.update({
        where: { id: createdHabit.id },
        data: { completed: true },
      });
    }

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

const createHabitProgresses = async (habit: Habit) => {
  // Fetch all activities once
  const activities = await prisma.activity.findMany({
    where: {
      userId: habit.userId,
      categoryId: habit.categoryId,
      date: {
        gte: habit.startDate,
        lte: habit.endDate,
      },
    },
    select: {
      date: true,
      duration: true,
    },
  });

  let currentDate = habit.startDate;
  const progresses: HabitProgress[] = [];
  let order = 1;
  let currentStreak = 0;
  let bestStreak = 0;

  while (currentDate <= habit.endDate) {
    logService("createHabitProgresses");
    const progress = await calculateProgress(
      habit,
      currentDate,
      order,
      activities
    );

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
    await prisma.habitProgress.createMany({
      data: progresses,
    });
    // Update habit streaks
    if (currentStreak > 0 || bestStreak > 0) {
      await prisma.habit.update({
        where: { id: habit.id },
        data: { currentStreak, bestStreak },
      });
    }
    return progresses;
  } catch (error) {
    throw error;
  }
};
