"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { TaskSchema } from "@/schema";
import { Task } from "@prisma/client";
import { z } from "zod";

export const createTask = async (
  newTask: z.infer<typeof TaskSchema>,
  userId: string
) => {
  const validatedFields = TaskSchema.safeParse(newTask);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields!",
      success: false,
    };
  }

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      id: newTask.categoryId,
      userId,
    },
  });

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

  const startDate = new Date();
  const endDate = parseDate(newTask.endDate);

  try {
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

export const updateTask = async (data: Task) => {};

export const deleteTask = async (id: string) => {};
