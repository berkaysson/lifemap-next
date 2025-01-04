"use server";

import prisma from "@/lib/prisma";
import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import { updateHabitsCompletedDurationByActivityDate } from "@/helpers/habit";
import { logService } from "@/lib/utils";
import { getActivityById } from "./getActivites";

export const deleteActivity = async (id: string) => {
  logService("deleteActivity");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    const activity = await getActivityById(id);

    if (!activity) {
      return {
        message: "Activity does not exist",
        success: false,
      };
    }

    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    await updateTasksCompletedDurationByActivityDate(
      activity.userId,
      activity.categoryId,
      activity.date,
      -activity.duration
    );

    await updateHabitsCompletedDurationByActivityDate(
      activity.userId,
      activity.categoryId,
      activity.date,
      -activity.duration
    );

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
