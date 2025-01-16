"use server";

import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";
import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import { updateHabitsCompletedDurationByActivityDate } from "@/helpers/habit";
import { getActivityDuration } from "@/helpers/activity";
import { logService } from "@/lib/utils";

export const updateActivity = async (data: Activity) => {
  logService("updateActivity");
  if (!data || !data.categoryId || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  if (data.duration < 0) {
    return {
      message: "Duration cannot be negative",
      success: false,
    };
  }

  try {
    const oldActivityDuration = await getActivityDuration(data.id);

    if (!oldActivityDuration) {
      return {
        message: "Activity does not exist",
        success: false,
      };
    }

    const absoluteDuration = data.duration - oldActivityDuration;

    await prisma.activity.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description || undefined,
        duration: data.duration,
        categoryId: data.categoryId,
        date: data.date,
      },
    });

    const updates = [
      updateTasksCompletedDurationByActivityDate(
        data.userId,
        data.categoryId,
        data.date,
        absoluteDuration
      ),
      updateHabitsCompletedDurationByActivityDate(
        data.userId,
        data.categoryId,
        data.date,
        absoluteDuration
      ),
    ];

    await Promise.all(updates);

    return {
      message: "Successfully updated activity",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to update activity: ${error}`,
      success: false,
    };
  }
};
