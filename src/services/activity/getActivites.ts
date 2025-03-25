"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { Activity } from "@prisma/client";

export const getActivities = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  sortField: keyof Activity = "date",
  sortOrder: "asc" | "desc" = "desc"
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
        orderBy: { [sortField]: sortOrder },
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
