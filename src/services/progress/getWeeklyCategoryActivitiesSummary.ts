"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { WeeklyActivitySummary } from "@/types/types";
import {
  subWeeks,
  startOfWeek,
  endOfWeek,
  formatISO,
  addWeeks,
  endOfDay,
  startOfDay,
} from "date-fns";

export const getWeeklyCategoryActivitiesSummary = async (
  userId: string,
  categoryId: string,
  weekOffset: number = 0
) => {
  logService("getWeeklyCategoryActivitiesSummary");

  if (!userId) {
    return { message: "userId is required", success: false };
  }

  if (!categoryId) {
    return {
      message: "No categoryId provided.",
      success: true,
      data: [], 
    };
  }

  try {
    const candidateEnd = endOfDay(addWeeks(new Date(), weekOffset));
    const todayEnd = endOfDay(new Date());
    const endDate = candidateEnd > todayEnd ? todayEnd : candidateEnd;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    const proposedStart = subWeeks(endDate, 12);
    const startDate = user?.emailVerified
      ? new Date(
          Math.max(
            startOfDay(user.emailVerified).getTime(),
            proposedStart.getTime()
          )
        )
      : proposedStart;

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        categoryId: categoryId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!activities.length) {
      return {
        message:
          "No activities found for the selected category in this period.",
        success: true,
        data: [],
      };
    }

    const summaryMap = new Map<
      string,
      Omit<WeeklyActivitySummary, "categoryBreakdown">
    >();

    for (const activity of activities) {
      const weekStartDate = startOfWeek(activity.date, { weekStartsOn: 1 });
      const weekKey = formatISO(weekStartDate, { representation: "date" });

      if (!summaryMap.has(weekKey)) {
        const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });
        summaryMap.set(weekKey, {
          weekStartDate,
          weekEndDate,
          totalDuration: 0,
        });
      }

      const weeklySummary = summaryMap.get(weekKey)!;
      weeklySummary.totalDuration += activity.duration;
    }

    const result = Array.from(summaryMap.values()).sort(
      (a, b) => a.weekStartDate.getTime() - b.weekStartDate.getTime()
    );

    return {
      message: "Successfully fetched weekly summary for selected category",
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `Failed to fetch weekly category activity summary: ${errorMessage}`
    );
    return {
      message: `Failed to fetch weekly category activity summary: ${errorMessage}`,
      success: false,
    };
  }
};
