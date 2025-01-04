"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const deleteTask = async (id: string) => {
  logService("deleteTask");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!task) {
      return {
        message: "Task does not exist",
        success: false,
      };
    }

    await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "Successfully deleted task",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete task: ${error}`,
      success: false,
    };
  }
};
