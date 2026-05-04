"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const deleteHabit = async (id: string) => {
  logService("deleteHabit");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
      },
    });

    if (!habit) {
      return {
        message: "Habit does not exist",
        success: false,
      };
    }

    const userId = habit.userId;

    await prisma.habitProgress.deleteMany({
      where: {
        habitId: id,
      },
    });

    await prisma.habit.delete({
      where: {
        id: id,
      },
    });

    revalidateTag("habits");
    revalidateTag(`habits-${userId}`);

    return {
      message: "Successfully deleted Habit",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete Habit: ${error}`,
      success: false,
    };
  }
};
