"use server";

import { getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import prisma from "@/lib/prisma";
import { checkIsStartDateBeforeEndDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { Task } from "@prisma/client";

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  logService("updateTask");

  // Early validation checks
  if (!taskId || Object.keys(data).length === 0) {
    return {
      message: "Data is required",
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
      message: "Category cannot be changed, create a new task",
      success: false,
    };
  }

  try {
    // Check for existing task and validate it
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return { message: "Task not found", success: false };
    }

    // Build update data object
    let updateData: Partial<Task> = { ...data };

    // Handle date validation and duration update
    if ("startDate" in data || "endDate" in data) {
      const startDate = data.startDate || existingTask.startDate;
      const endDate = data.endDate || existingTask.endDate;

      if (!checkIsStartDateBeforeEndDate(startDate, endDate)) {
        return {
          message: "Start date cannot be after due date",
          success: false,
        };
      }

      // Fetch total duration only if startDate/endDate changed
      updateData.completedDuration =
        await getActivitiesTotalDurationBetweenDates(
          existingTask.userId,
          existingTask.categoryId,
          startDate,
          endDate
        );
    }

    // Handle goal duration validation
    if ("goalDuration" in data) {
      const goalDuration = data.goalDuration ?? existingTask.goalDuration;
      const completedDuration = existingTask.completedDuration;
      updateData.completed = goalDuration <= completedDuration;
    }

    // Perform update
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
