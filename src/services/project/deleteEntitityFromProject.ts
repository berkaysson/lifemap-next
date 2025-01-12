"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

// Generic delete function
const deleteFromProject = async (
  relation: "todos" | "tasks" | "habits",
  itemId: string,
  projectId: string
) => {
  logService(
    `delete${relation.charAt(0).toUpperCase() + relation.slice(1)}FromProject`
  );
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        [relation]: {
          disconnect: {
            id: itemId,
          },
        },
      },
    });

    return {
      message: `Successfully removed ${relation.slice(0, -1)} from project`,
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove ${relation.slice(
        0,
        -1
      )} from project: ${error}`,
      success: false,
    };
  }
};

export const deleteToDoFromProject = (todoId: string, projectId: string) => {
  return deleteFromProject("todos", todoId, projectId);
};

export const deleteTaskFromProject = (taskId: string, projectId: string) => {
  return deleteFromProject("tasks", taskId, projectId);
};

export const deleteHabitFromProject = (habitId: string, projectId: string) => {
  return deleteFromProject("habits", habitId, projectId);
};
