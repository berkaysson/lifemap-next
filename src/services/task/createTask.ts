"use server";

import { getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import { checkIsCategoryExistsByCategoryId } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { checkIsStartDateBeforeEndDate, parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { TaskSchema } from "@/schema";
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
