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
