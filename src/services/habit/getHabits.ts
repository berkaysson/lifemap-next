"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

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
      select: {
        id: true,
        name: true,
        description: true,
        colorCode: true,
        completed: true,
        period: true,
        numberOfPeriods: true,
        startDate: true,
        endDate: true,
        goalDurationPerPeriod: true,
        currentStreak: true,
        bestStreak: true,
        categoryId: true,
        projectId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        progress: {
          select: {
            id: true,
            userId: true,
            categoryId: true,
            goalDuration: true,
            order: true,
            startDate: true,
            endDate: true,
            completedDuration: true,
            completed: true,
            habitId: true,
          },
        },
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
