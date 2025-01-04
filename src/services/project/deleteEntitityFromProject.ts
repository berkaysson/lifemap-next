"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const deleteToDoFromProject = async (
  todoId: string,
  projectId: string
) => {
  logService("deleteToDoFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        todos: {
          disconnect: {
            id: todoId,
          },
        },
      },
    });
    return {
      message: "Successfully removed todo from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove todo from project: ${error}`,
      success: false,
    };
  }
};

export const deleteTaskFromProject = async (
  taskId: string,
  projectId: string
) => {
  logService("deleteTaskFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        tasks: {
          disconnect: {
            id: taskId,
          },
        },
      },
    });
    return {
      message: "Successfully removed task from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove task from project: ${error}`,
      success: false,
    };
  }
};

export const deleteHabitFromProject = async (
  habitId: string,
  projectId: string
) => {
  logService("deleteHabitFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        habits: {
          disconnect: {
            id: habitId,
          },
        },
      },
    });
    return {
      message: "Successfully removed habit from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove habit from project: ${error}`,
      success: false,
    };
  }
};
