"use server";

import prisma from "@/lib/prisma";
import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import { updateHabitsCompletedDurationByActivityDate } from "@/helpers/habit";
import { logService } from "@/lib/utils";
import { ExtendedActivity } from "@/types/Entitities";

export const deleteActivity = async (activity: ExtendedActivity) => {
  logService("deleteActivity");
  if (!activity) {
    return {
      message: "Activity does not exist",
      success: false,
    };
  }

  const { id } = activity;

  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    const updates = [
      updateTasksCompletedDurationByActivityDate(
        activity.userId,
        activity.categoryId,
        activity.date,
        -activity.duration
      ),
      updateHabitsCompletedDurationByActivityDate(
        activity.userId,
        activity.categoryId,
        activity.date,
        -activity.duration
      ),
    ];

    await Promise.all(updates);

    return {
      message: "Successfully deleted activity",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete activity: ${error}`,
      success: false,
    };
  }
};
