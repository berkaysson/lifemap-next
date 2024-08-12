"use server";

import prisma from "@/lib/prisma";
import { addOneDay, parseDate } from "@/lib/time";
import { ActivitySchema } from "@/schema";
import { Activity } from "@prisma/client";
import { z } from "zod";

export const createActivity = async (
  newActivity: z.infer<typeof ActivitySchema>,
  userId: string
) => {
  const validatedFields = ActivitySchema.safeParse(newActivity);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields!",
      success: false,
    };
  }

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      id: newActivity.categoryId,
      userId,
    },
  });

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

    await updateRelatedTasks(
      userId,
      newActivity.categoryId,
      date,
      newActivity.duration
    );

    await updateRelatedHabitProgresses(
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
  if (!data || !data.categoryId || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      userId: data.userId,
    },
  });

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

  const oldActivity = await prisma.activity.findFirst({
    where: {
      id: data.id,
    },
  });

  if (!oldActivity) {
    return {
      message: "Activity does not exist",
      success: false,
    };
  }

  try {
    const absoluteDuration = data.duration - oldActivity.duration;

    await prisma.activity.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    await updateRelatedTasks(
      data.userId,
      data.categoryId,
      oldActivity.date,
      absoluteDuration
    );

    await updateRelatedHabitProgresses(
      data.userId,
      data.categoryId,
      oldActivity.date,
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
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  const activity = await prisma.activity.findFirst({
    where: {
      id: id,
    },
  });

  if (!activity) {
    return {
      message: "Activity does not exist",
      success: false,
    };
  }

  try {
    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    await updateRelatedTasks(
      activity.userId,
      activity.categoryId,
      activity.date,
      -activity.duration
    );

    await updateRelatedHabitProgresses(
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

const updateRelatedTasks = async (
  userId: string,
  categoryId: string,
  activityDate: Date,
  duration: number
) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      categoryId,
      startDate: { lte: activityDate },
      endDate: { gte: activityDate },
    },
  });

  for (const task of tasks) {
    const newCompletedDuration = task.completedDuration + duration;
    const completed = newCompletedDuration >= task.goalDuration;

    await prisma.task.update({
      where: { id: task.id },
      data: {
        completedDuration: newCompletedDuration,
        completed,
      },
    });
  }
};

const updateRelatedHabitProgresses = async (
  userId: string,
  categoryId: string,
  activityDate: Date,
  duration: number
) => {
  const endDate = activityDate;
  const habitProgresses = await prisma.habitProgress.findMany({
    where: {
      userId,
      categoryId,
      startDate: { lte: activityDate },
      endDate: { gte: endDate },
    },
  });

  for (const habitProgress of habitProgresses) {
    const newCompletedDuration = habitProgress.completedDuration + duration;
    const completed = newCompletedDuration >= habitProgress.goalDuration;

    await prisma.habitProgress.update({
      where: { id: habitProgress.id },
      data: {
        completedDuration: newCompletedDuration,
        completed,
      },
    });
  }
};
