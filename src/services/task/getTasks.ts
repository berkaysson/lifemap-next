"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export const getTasks = async (userId: string) => {
  logService("getTasks");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }

  const fetchTasks = unstable_cache(
    async (userId: string) => {
      logService("getTasks - calculate");
      try {
        const tasks = await prisma.task.findMany({
          where: {
            userId,
          },
          include: {
            category: true,
          },
        });
        return {
          message: "Successfully fetched tasks",
          success: true,
          tasks,
        };
      } catch (error) {
        return {
          message: `Failed to fetch tasks: ${error}`,
          success: false,
        };
      }
    },
    [`tasks-${userId}`],
    {
      tags: [`tasks-${userId}`, "tasks"],
      revalidate: 3600,
    },
  );

  return fetchTasks(userId);
};
