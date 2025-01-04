"use server";

import { getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import { checkIsCategoryExistsByCategoryId } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { checkIsStartDateBeforeEndDate, parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { TaskSchema } from "@/schema";
import { Task } from "@prisma/client";
import { z } from "zod";

export async function archiveTask(id: string) {
  logService("archiveTask");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    // Get the task with its category information
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!task) {
      return { message: "Task not found", success: false };
    }

    // Create archived version
    await prisma.archivedTask.create({
      data: {
        name: task.name,
        description: task.description,
        colorCode: task.colorCode,
        completed: task.completed,
        completedDuration: task.completedDuration,
        goalDuration: task.goalDuration,
        startDate: task.startDate,
        endDate: task.endDate,
        categoryId: task.categoryId,
        categoryName: task.category.name,
        userId: task.userId,
        projectId: task.projectId,
      },
    });

    // Delete the original task
    await prisma.task.delete({
      where: { id },
    });

    return { message: "Successfully archived task", success: true };
  } catch (error) {
    return { message: `Failed to archive task: ${error}`, success: false };
  }
}

export async function getArchivedTasks(userId: string) {
  logService("getArchivedTasks");
  try {
    const archivedTasks = await prisma.archivedTask.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: {
        archivedAt: "desc",
      },
    });
    return {
      message: "Successfully fetched archived tasks",
      success: true,
      archivedTasks,
    };
  } catch (error) {
    return {
      message: `Failed to fetch archived tasks: ${error}`,
      success: false,
    };
  }
}

export async function deleteArchivedTask(id: string) {
  logService("deleteArchivedTask");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    await prisma.archivedTask.delete({
      where: { id },
    });
    return { message: "Successfully deleted archived task", success: true };
  } catch (error) {
    return {
      message: `Failed to delete archived task: ${error}`,
      success: false,
    };
  }
}
