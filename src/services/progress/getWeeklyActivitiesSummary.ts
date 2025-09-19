"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { WeeklyActivitySummary } from "@/types/types";
import {
  subMonths,
  startOfWeek,
  endOfWeek,
  formatISO,
  addMonths,
  endOfDay,
  startOfDay,
} from "date-fns";

export const getWeeklyActivitiesSummary = async (
  userId: string,
  monthOffset: number = 0
) => {
  logService("getWeeklyActivitiesSummary");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  try {
    // Clamp end date to today at end of day (disallow future)
    const candidateEnd = endOfDay(addMonths(new Date(), monthOffset));
    const todayEnd = endOfDay(new Date());
    const endDate = candidateEnd > todayEnd ? todayEnd : candidateEnd;

    // Fetch user's emailVerified to limit earliest start date
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    const proposedStart = subMonths(endDate, 3);
    const startDate = user?.emailVerified
      ? new Date(
          Math.max(startOfDay(user.emailVerified).getTime(), proposedStart.getTime())
        )
      : proposedStart;

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!activities.length) {
      return {
        message: "No activities found in the selected period.",
        success: true,
        data: [],
      };
    }

    const summaryMap = new Map<string, WeeklyActivitySummary>();

    for (const activity of activities) {
      const weekStartDate = startOfWeek(activity.date, { weekStartsOn: 1 });
      const weekKey = formatISO(weekStartDate, { representation: "date" });

      if (!summaryMap.has(weekKey)) {
        const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });
        summaryMap.set(weekKey, {
          weekStartDate,
          weekEndDate,
          totalDuration: 0,
          categoryBreakdown: {},
        });
      }

      const weeklySummary = summaryMap.get(weekKey)!;
      weeklySummary.totalDuration += activity.duration;

      const categoryName = activity.category.name;
      weeklySummary.categoryBreakdown[categoryName] =
        (weeklySummary.categoryBreakdown[categoryName] || 0) +
        activity.duration;
    }

    const result = Array.from(summaryMap.values()).sort(
      (a, b) => a.weekStartDate.getTime() - b.weekStartDate.getTime()
    );

    return {
      message: "Successfully fetched weekly activity summary",
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch weekly activity summary: ${errorMessage}`);
    return {
      message: `Failed to fetch weekly activity summary: ${errorMessage}`,
      success: false,
    };
  }
};
