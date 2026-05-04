"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export const getRecentActivities = async (
  userId: string,
  limit: number = 20,
) => {
  logService("getRecentActivities");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  const fetchActivities = unstable_cache(
    async (userId: string, limit: number) => {
      logService("getRecentActivities - calculate");
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
    },
    [`recent-activities-${userId}-${limit}`],
    {
      tags: [`activities-${userId}`, "activities"],
      revalidate: 3600,
    },
  );

  return fetchActivities(userId, limit);
};
