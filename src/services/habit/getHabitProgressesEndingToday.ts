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
