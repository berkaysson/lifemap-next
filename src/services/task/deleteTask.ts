"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const deleteTask = async (id: string) => {
  logService("deleteTask");

  if (!id) {
    return {
      message: "Task ID is required",
      success: false,
    };
  }

  try {
    // Delete the task directly
    await prisma.task.delete({
      where: { id },
    });

    return {
      message: "Successfully deleted task",
      success: true,
    };
  } catch (error: any) {
    // Handle specific errors (e.g., task not found)
    if (error.code === "P2025") {
      return {
        message: "Task does not exist",
        success: false,
      };
    }

    // General error handling
    return {
      message: "Failed to delete task due to an unexpected error",
      success: false,
    };
  }
};
