"use server";

import {
  calculateProgress,
  updateHabitCompleted,
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
  logService("getHabits");
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

export const updateHabit = async () => {
  logService("updateHabit");
};

export const deleteHabit = async (id: string) => {
  logService("deleteHabit");
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

const createHabitProgresses = async (habit: Habit) => {
  let currentDate = habit.startDate;
  const progresses: HabitProgress[] = [];
  let order = 1;
  let currentStreak = 0;
  let bestStreak = 0;

  while (currentDate <= habit.endDate) {
    logService("createHabitProgresses");
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

export async function archiveHabit(id: string) {
  logService("archiveHabit");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    // Get the habit with its category and progress information
    const habit = await prisma.habit.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
        progress: true,
      },
    });

    if (!habit) {
      return { message: "Habit not found", success: false };
    }

    // Create archived version
    await prisma.archivedHabit.create({
      data: {
        name: habit.name,
        description: habit.description,
        colorCode: habit.colorCode,
        completed: habit.completed,
        period: habit.period,
        numberOfPeriods: habit.numberOfPeriods,
        startDate: habit.startDate,
        endDate: habit.endDate,
        goalDurationPerPeriod: habit.goalDurationPerPeriod,
        currentStreak: habit.currentStreak,
        bestStreak: habit.bestStreak,
        categoryId: habit.categoryId,
        categoryName: habit.category.name,
        userId: habit.userId,
        projectId: habit.projectId,
      },
    });

    // Delete all related habit progress records
    await prisma.habitProgress.deleteMany({
      where: {
        habitId: id,
      },
    });

    // Delete the original habit
    await prisma.habit.delete({
      where: { id },
    });

    return { message: "Successfully archived habit", success: true };
  } catch (error) {
    return { message: `Failed to archive habit: ${error}`, success: false };
  }
}

export async function getArchivedHabits(userId: string) {
  logService("getArchivedHabits");
  try {
    const archivedHabits = await prisma.archivedHabit.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: {
        archivedAt: "desc",
      },
    });
    return {
      message: "Successfully fetched archived habits",
      success: true,
      archivedHabits,
    };
  } catch (error) {
    return {
      message: `Failed to fetch archived habits: ${error}`,
      success: false,
    };
  }
}

export async function deleteArchivedHabit(id: string) {
  logService("deleteArchivedHabit");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    await prisma.archivedHabit.delete({
      where: { id },
    });
    return { message: "Successfully deleted archived habit", success: true };
  } catch (error) {
    return {
      message: `Failed to delete archived habit: ${error}`,
      success: false,
    };
  }
}
