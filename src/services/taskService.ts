"use server";

import { getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import { checkIsCategoryExistsByCategoryId } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { checkIsStartDateBeforeEndDate, parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { TaskSchema } from "@/schema";
import { Task } from "@prisma/client";
import { z } from "zod";

export const createTask = async (
  newTask: z.infer<typeof TaskSchema>,
  userId: string
) => {
  logService("createTask");
  const validatedFields = TaskSchema.safeParse(newTask);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields!",
      success: false,
    };
  }

  const isCategoryExist = await checkIsCategoryExistsByCategoryId(
    newTask.categoryId,
    userId
  );

  if (!isCategoryExist) {
    return {
      message: "Category does not exist",
      success: false,
    };
  }

  if (newTask.goalDuration < 0) {
    return {
      message: "Goal duration cannot be negative",
      success: false,
    };
  }

  const startDate = parseDate(newTask.startDate);
  const endDate = parseDate(newTask.endDate);

  if (!checkIsStartDateBeforeEndDate(startDate, endDate)) {
    return {
      message: "Start date cannot be greater than due",
      success: false,
    };
  }

  try {
    const completedDuration = await getActivitiesTotalDurationBetweenDates(
      userId,
      newTask.categoryId,
      startDate,
      endDate
    );

    const completed = completedDuration >= newTask.goalDuration;

    await prisma.task.create({
      data: {
        name: newTask.name,
        description: newTask.description || undefined,
        colorCode: newTask.colorCode || "#000000",
        goalDuration: newTask.goalDuration,
        startDate,
        endDate,
        userId,
        categoryId: newTask.categoryId,
        projectId: undefined,
        completedDuration,
        completed,
      },
    });
    return {
      message: "Successfully created task",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to create task: ${error}`,
      success: false,
    };
  }
};

export const getTasks = async (userId: string) => {
  logService("getTasks");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
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
};

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  logService("updateTask");
  if (!taskId || Object.keys(data).length === 0) {
    return {
      message: "data is required",
      success: false,
    };
  }

  if (data.goalDuration && data.goalDuration < 0) {
    return {
      message: "Goal duration cannot be negative",
      success: false,
    };
  }

  if (data.categoryId) {
    return {
      message: "Category cannot be changed, you should create new task",
      success: false,
    };
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return { message: "Task not found", success: false };
    }

    let updateData: Partial<Task> = { ...data };

    if ("startDate" in data || "endDate" in data) {
      const startDate = data.startDate || existingTask.startDate;
      const endDate = data.endDate || existingTask.endDate;

      if (!checkIsStartDateBeforeEndDate(startDate, endDate)) {
        return {
          message: "Start date cannot be after due",
          success: false,
        };
      }

      updateData.completedDuration =
        await getActivitiesTotalDurationBetweenDates(
          existingTask.userId,
          existingTask.categoryId,
          startDate,
          endDate
        );
    }

    if ("goalDuration" in data) {
      const goalDuration = data.goalDuration ?? existingTask.goalDuration;
      const completedDuration = existingTask.completedDuration;
      updateData.completed = goalDuration <= completedDuration;
    }

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return {
      message: "Successfully updated task",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to update task: ${error}`,
      success: false,
    };
  }
};

export const deleteTask = async (id: string) => {
  logService("deleteTask");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!task) {
      return {
        message: "Task does not exist",
        success: false,
      };
    }

    await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "Successfully deleted task",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete task: ${error}`,
      success: false,
    };
  }
};

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
