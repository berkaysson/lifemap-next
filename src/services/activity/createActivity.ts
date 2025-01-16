"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { ActivitySchema } from "@/schema";
import { z } from "zod";
import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import { updateHabitsCompletedDurationByActivityDate } from "@/helpers/habit";
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

    const updates = [
      updateTasksCompletedDurationByActivityDate(
        userId,
        newActivity.categoryId,
        date,
        newActivity.duration
      ),
      updateHabitsCompletedDurationByActivityDate(
        userId,
        newActivity.categoryId,
        date,
        newActivity.duration
      ),
    ];

    await Promise.all(updates);

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
