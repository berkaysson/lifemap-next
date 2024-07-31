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

  const startDate = new Date();
  const endDate = parseDate(newTask.endDate);

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

export const updateTask = async (data: Task, updatedField: keyof Task) => {
  if (!data || !updatedField) {
    return {
      message: "data is required",
      success: false,
    };
  }

  if (updatedField === "goalDuration" && data.goalDuration < 0) {
    return {
      message: "Goal duration cannot be negative",
      success: false,
    };
  }

  if (updatedField === "categoryId") {
    return {
      message: "Category cannot be changed, you should create new task",
      success: false,
    };
  }

  try {
    if (updatedField === "endDate" || updatedField === "startDate") {
      return await updateTaskDates(data, updatedField);
    } else if (updatedField === "goalDuration") {
      return await updateTaskGoalDuration(data);
    } else {
      return await updateTaskField(data, updatedField);
    }
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

const updateTaskDates = async (
  data: Task,
  updatedField: "startDate" | "endDate"
) => {
  const isDateAvailable = checkStartDateAvailability(
    data.startDate,
    data.endDate
  );
  if (!isDateAvailable) {
    return { message: "Start date cannot be after end date", success: false };
  }

  const completedDuration = await calculateTaskCompletedDuration(
    data.userId,
    data.startDate,
    data.endDate
  );

  await prisma.task.update({
    where: { id: data.id },
    data: { [updatedField]: data[updatedField], completedDuration },
  });

  return { message: "Successfully updated task", success: true };
};

const updateTaskGoalDuration = async (data: Task) => {
  const completed = calculateCompletion(
    data.completedDuration,
    data.goalDuration
  );
  await prisma.task.update({
    where: { id: data.id },
    data: { goalDuration: data.goalDuration, completed },
  });
  return { message: "Successfully updated task", success: true };
};

const updateTaskField = async (data: Task, updatedField: keyof Task) => {
  await prisma.task.update({
    where: { id: data.id },
    data: { [updatedField]: data[updatedField] },
  });
  return { message: "Successfully updated task", success: true };
};
