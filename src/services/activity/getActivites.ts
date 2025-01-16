"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getActivities = async (userId: string) => {
  logService("getActivities");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });
    return {
      message: "Successfully fetched activities",
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
