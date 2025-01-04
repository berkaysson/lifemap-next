"use server";

import { getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import prisma from "@/lib/prisma";
import { checkIsStartDateBeforeEndDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { Task } from "@prisma/client";

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
