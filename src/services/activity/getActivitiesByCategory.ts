"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getActivitiesByCategory = async (
  userId: string,
  categoryId: string,
  limit: number = 20
) => {
  logService("getActivitiesByCategory");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  if (!categoryId) {
    return {
      message: "categoryId is required",
      success: false,
    };
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId,
        categoryId: categoryId,
      },
      orderBy: { date: "desc" },
      take: limit,
      include: { category: true },
    });

    return {
      message: "Successfully fetched activities by category",
      success: true,
      activities,
    };
  } catch (error) {
    return {
      message: `Failed to fetch activities: ${error}`,
      success: false,
    };
  }
};
