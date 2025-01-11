"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export async function archiveTask(id: string) {
  logService("archiveTask");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
      },
    });

    if (!task) {
      return { message: "Task not found", success: false };
    }

    // Archive task
    await prisma.archivedTask.create({ data: mapTaskToArchivedTask(task) });

    // Delete original task
    await prisma.task.delete({ where: { id } });

    return { message: "Successfully archived task", success: true };
  } catch (error: any) {
    return {
      message: `Failed to archive task: ${error.message}`,
      success: false,
    };
  }
}

export async function getArchivedTasks(userId: string) {
  logService("getArchivedTasks");
  if (!userId) {
    return { message: "userId is required", success: false };
  }

  try {
    const archivedTasks = await prisma.archivedTask.findMany({
      where: { userId },
      include: { project: true },
      orderBy: { archivedAt: "desc" },
    });

    return {
      message: "Successfully fetched archived tasks",
      success: true,
      archivedTasks,
    };
  } catch (error: any) {
    return {
      message: `Failed to fetch archived tasks: ${error.message}`,
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
    await prisma.archivedTask.delete({ where: { id } });
    return { message: "Successfully deleted archived task", success: true };
  } catch (error: any) {
    return {
      message: `Failed to delete archived task: ${error.message}`,
      success: false,
    };
  }
}

function mapTaskToArchivedTask(task) {
  return {
    name: task.name,
    description: task.description,
    colorCode: task.colorCode,
    completed: task.completed,
    completedDuration: task.completedDuration,
    goalDuration: task.goalDuration,
    startDate: task.startDate,
    endDate: task.endDate,
    categoryId: task.categoryId,
    categoryName: task.category?.name || null,
    userId: task.userId,
    projectId: task.projectId,
  };
}
