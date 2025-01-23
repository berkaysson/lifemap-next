"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const addItemToProject = async (
  projectId: string,
  itemId: string,
  itemType: "todos" | "tasks" | "habits"
) => {
  logService(`addItemToProject - ${itemType}`);

  // Input validation
  if (!projectId || !itemId) {
    return {
      message: "Project ID and item ID are required",
      success: false,
    };
  }

  try {
    // Dynamically update the project with the appropriate item type
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        [itemType]: {
          connect: { id: itemId },
        },
      },
    });

    return {
      message: `Successfully added ${itemType.slice(0, -1)} to project`,
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add ${itemType.slice(0, -1)} to project: ${error}`,
      success: false,
    };
  }
};

// Example usages for specific item types
export const addToDoToProject = async (todoId: string, projectId: string) =>
  await addItemToProject(projectId, todoId, "todos");

export const addTaskToProject = async (taskId: string, projectId: string) =>
  await addItemToProject(projectId, taskId, "tasks");

export const addHabitToProject = async (habitId: string, projectId: string) =>
  await addItemToProject(projectId, habitId, "habits");
