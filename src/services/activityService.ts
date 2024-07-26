"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { ActivitySchema } from "@/schema";
import { Activity } from "@prisma/client";
import { z } from "zod";

export const createActivity = async (
  newActivity: z.infer<typeof ActivitySchema>,
  userId: string
) => {
  if (!newActivity || !newActivity.duration) {
    return {
      message: "Duration is required",
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

  try {
    await prisma.activity.update({
      where: {
        id: data.id,
      },
      data: data,
    });
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
  try {
    await prisma.activity.delete({
      where: {
        id: id,
      },
    });
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
