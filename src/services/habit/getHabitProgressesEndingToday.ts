"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getHabitProgressesEndingToday = async (userId: string) => {
  logService("getHabitProgressesEndingToday");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const progresses = await prisma.habitProgress.findMany({
      where: {
        userId,
        endDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
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
        habit: {
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
          },
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });

    return {
      message: "Successfully fetched habit progresses ending today",
      success: true,
      progresses,
    };
  } catch (error) {
    return {
      message: `Failed to fetch habit progresses: ${error}`,
      success: false,
    };
  }
};
