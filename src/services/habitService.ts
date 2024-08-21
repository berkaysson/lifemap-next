"use server";

import { createHabitProgresses, updateHabitCompleted } from "@/data/habit";
import prisma from "@/lib/prisma";
import {
  calculateEndDateWithPeriod,
  checkIsStartDateBeforeEndDate,
  parseDate,
  removeOneDay,
} from "@/lib/time";
import { HabitSchema } from "@/schema";
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

    await createHabitProgresses(createdHabit);
    await updateHabitCompleted(createdHabit.id);

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
        progress: true,
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

export const updateHabit = async () => {};

export const deleteHabit = async (id: string) => {
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
      },
    });

    if (!habit) {
      return {
        message: "Habit does not exist",
        success: false,
      };
    }

    await prisma.habitProgress.deleteMany({
      where: {
        habitId: id,
      },
    });

    await prisma.habit.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "Successfully deleted Habit",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete Habit: ${error}`,
      success: false,
    };
  }
};
