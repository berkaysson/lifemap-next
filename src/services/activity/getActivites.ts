"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getActivities = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  logService("getActivities");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  try {
    const skip = (page - 1) * pageSize;

    const [total, activities] = await Promise.all([
      prisma.activity.count({ where: { userId } }),
      prisma.activity.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: "desc" },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      message: "Successfully fetched activities",
      success: true,
      activities,
      total,
    };
  } catch (error) {
    return {
      message: `Failed to fetch activities: ${error}`,
      success: false,
    };
  }
};
