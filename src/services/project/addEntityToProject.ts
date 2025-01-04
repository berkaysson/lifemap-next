"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const addToDoToProject = async (todoId: string, projectId: string) => {
  logService("addToDoToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        todos: {
          connect: {
            id: todoId,
          },
        },
      },
    });
    return {
      message: "Successfully added todo to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add todo to project: ${error}`,
      success: false,
    };
  }
};

export const addTaskToProject = async (taskId: string, projectId: string) => {
  logService("addTaskToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        tasks: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    return {
      message: "Successfully added task to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add task to project: ${error}`,
      success: false,
    };
  }
};

export const addHabitToProject = async (habitId: string, projectId: string) => {
  logService("addHabitToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        habits: {
          connect: {
            id: habitId,
          },
        },
      },
    });
    return {
      message: "Successfully added habit to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add habit to project: ${error}`,
      success: false,
    };
  }
};
