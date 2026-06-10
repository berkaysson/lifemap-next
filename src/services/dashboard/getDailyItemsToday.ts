"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getDailyItemsToday = async (userId: string) => {
  logService("getDailyItemsToday");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
      data: {
        todos: [],
        tasks: [],
        habitProgresses: [],
      },
    };
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todos, tasks, habitProgresses] = await Promise.all([
      // 1. Fetch Todos due today
      prisma.toDo.findMany({
        where: {
          userId,
          endDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          colorCode: true,
          completed: true,
          startDate: true,
          endDate: true,
          userId: true,
          projectId: true,
        },
      }),

      // 2. Fetch Tasks due today
      prisma.task.findMany({
        where: {
          userId,
          endDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          colorCode: true,
          completed: true,
          completedDuration: true,
          goalDuration: true,
          startDate: true,
          endDate: true,
          categoryId: true,
          projectId: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // 3. Fetch Habit Progresses due today
      prisma.habitProgress.findMany({
        where: {
          userId,
          endDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          id: true,
          userId: true,
          categoryId: true,
          goalDuration: true,
          order: true,
          startDate: true,
          endDate: true,
          completedDuration: true,
          completed: true,
          habitId: true,
          habit: {
            select: {
              id: true,
              name: true,
              description: true,
              colorCode: true,
              completed: true,
              period: true,
              numberOfPeriods: true,
              startDate: true,
              endDate: true,
              goalDurationPerPeriod: true,
              currentStreak: true,
              bestStreak: true,
              categoryId: true,
              projectId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          endDate: "asc",
        },
      }),
    ]);

    return {
      message: "Successfully fetched daily items",
      success: true,
      data: {
        todos,
        tasks,
        habitProgresses,
      },
    };
  } catch (error) {
    return {
      message: `Failed to fetch daily items: ${error}`,
      success: false,
      data: {
        todos: [],
        tasks: [],
        habitProgresses: [],
      },
    };
  }
};
