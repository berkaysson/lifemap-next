"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getRecentActivities = async (
  userId: string,
  limit: number = 20
) => {
  logService("getRecentActivities");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take: limit,
    });

    return {
      message: "Successfully fetched recent activities",
      success: true,
      activities,
    };
  } catch (error) {
    return {
      message: `Failed to fetch recent activities: ${error}`,
      success: false,
    };
  }
};
