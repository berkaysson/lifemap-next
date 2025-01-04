"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

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
