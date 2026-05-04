"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const deleteTask = async (id: string) => {
  logService("deleteTask");

  if (!id) {
    return {
      message: "Task ID is required",
      success: false,
    };
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!task) {
      return {
        message: "Task does not exist",
        success: false,
      };
    }

    // Delete the task directly
    await prisma.task.delete({
      where: { id },
    });

    revalidateTag("tasks");
    revalidateTag(`tasks-${task.userId}`);

    return {
      message: "Successfully deleted task",
      success: true,
    };
  } catch (error: any) {
    // General error handling
    return {
      message: `Failed to delete task: ${error.message}`,
      success: false,
    };
  }
};
