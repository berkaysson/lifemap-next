"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getHabitProgressesEndingInDays = async (
  userId: string,
  days: number
) => {
  logService("getHabitProgressesEndingInDays");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const targetEnd = new Date();
    targetEnd.setDate(targetEnd.getDate() + days);
    targetEnd.setHours(23, 59, 59, 999);

    const progresses = await prisma.habitProgress.findMany({
      where: {
        userId,
        endDate: {
          gte: todayStart,
          lte: targetEnd,
        },
      },
      include: {
        habit: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });

    return {
      message: `Successfully fetched habit progresses ending within ${days} days`,
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
