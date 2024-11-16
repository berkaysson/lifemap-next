"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { ActivitySchema } from "@/schema";
import { Activity } from "@prisma/client";
import { z } from "zod";
import { checkIsCategoryExistsByCategoryId } from "@/helpers/category";
import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import { updateHabitsCompletedDurationByActivityDate } from "@/helpers/habit";
import { getActivityById, getActivityDuration } from "@/helpers/activity";
import { logService } from "@/lib/utils";

export const createActivity = async (
  newActivity: z.infer<typeof ActivitySchema>,
  userId: string
) => {
  logService("createActivity");
  const validatedFields = ActivitySchema.safeParse(newActivity);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields!",
      success: false,
    };
  }

  const isCategoryExist = await checkIsCategoryExistsByCategoryId(
    newActivity.categoryId,
    userId
  );

  if (!isCategoryExist) {
    return {
      message: "Category does not exist",
      success: false,
    };
  }

  if (newActivity.duration < 0) {
    return {
      message: "Duration cannot be negative",
      success: false,
    };
  }

  const date = parseDate(newActivity.date);

  try {
    await prisma.activity.create({
      data: {
        description: newActivity.description || undefined,
        duration: newActivity.duration,
        categoryId: newActivity.categoryId,
        userId,
        date: date,
      },
    });

    await updateTasksCompletedDurationByActivityDate(
      userId,
      newActivity.categoryId,
      date,
      newActivity.duration
    );

    await updateHabitsCompletedDurationByActivityDate(
      userId,
      newActivity.categoryId,
      date,
      newActivity.duration
    );

    return {
      message: "Successfully created activity",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to create activity: ${error}`,
      success: false,
    };
  }
};

export const getActivities = async (userId: string) => {
  logService("getActivities");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });
    return {
      message: "Successfully fetched activities",
      success: true,
      activities,
    };
  } catch (error) {
    return {
      message: `Failed to fetch activities: ${error}`,
      success: false,
    };
  }
};

export const updateActivity = async (data: Activity) => {
  logService("updateActivity");
  if (!data || !data.categoryId || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  const isCategoryExist = await checkIsCategoryExistsByCategoryId(
    data.categoryId,
    data.userId
  );

  if (!isCategoryExist) {
    return {
      message: "Category does not exist",
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

    await updateTasksCompletedDurationByActivityDate(
      data.userId,
      data.categoryId,
      data.date,
      absoluteDuration
    );

    await updateHabitsCompletedDurationByActivityDate(
      data.userId,
      data.categoryId,
      data.date,
      absoluteDuration
    );

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
