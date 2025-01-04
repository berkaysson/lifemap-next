"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getProjects = async (userId: string) => {
  logService("getProjects");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        todos: true,
        tasks: true,
        habits: true,
      },
    });
    return {
      message: "Successfully fetched projects",
      success: true,
      projects,
    };
  } catch (error) {
    return {
      message: `Failed to fetch projects: ${error}`,
      success: false,
    };
  }
};
