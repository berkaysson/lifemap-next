"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const deleteProject = async (id: string) => {
  logService("deleteProject");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    await prisma.project.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Successfully deleted project",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete project: ${error}`,
      success: false,
    };
  }
};
