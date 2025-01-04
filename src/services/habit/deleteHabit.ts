"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

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
