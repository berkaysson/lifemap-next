"use server";

import prisma from "@/lib/prisma";
import { addOneDay, checkStartDateAvailability, parseDate } from "@/lib/time";
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

  const startDate = parseDate(newTask.startDate);
  const endDate = parseDate(newTask.endDate);

  if (!checkStartDateAvailability(startDate, endDate)) {
    return {
      message: "Start date cannot be greater than due",
      success: false,
    };
  }

  try {
    const completedDuration = await calculateTaskCompletedDuration(
      userId,
      startDate,
      endDate
    );

    const completed = calculateCompletion(
      completedDuration,
      newTask.goalDuration
    );

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

export const updateTask = async (taskId: string, data: Partial<Task>) => {
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

      if (!checkStartDateAvailability(startDate, endDate)) {
        return {
          message: "Start date cannot be after due",
          success: false,
        };
      }

      updateData.completedDuration = await calculateTaskCompletedDuration(
        existingTask.userId,
        startDate,
        endDate
      );
    }

    if ("goalDuration" in data) {
      const goalDuration = data.goalDuration ?? existingTask.goalDuration;
      const completedDuration = existingTask.completedDuration;
      updateData.completed = calculateCompletion(
        completedDuration,
        goalDuration
      );
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
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

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

  try {
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

const calculateTaskCompletedDuration = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const activities = await prisma.activity.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (activities.length === 0) {
    return 0;
  }

  const totalDuration = activities
    .map((activity) => activity.duration)
    .reduce((total, duration) => total + duration, 0);

  return totalDuration;
};

const calculateCompletion = (
  completedDuration: number,
  goalDuration: number
) => {
  const isCompleted = completedDuration >= goalDuration;
  return isCompleted;
};
