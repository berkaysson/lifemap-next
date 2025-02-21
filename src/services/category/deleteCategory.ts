"use server";

import { checkIsCategoryUsed } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const deleteCategory = async (id: string) => {
  logService("deleteCategory");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  const canBeDeleted = await checkIsCategoryUsed(id);

  if (!canBeDeleted) {
    return {
      message: "Activity Type cannot be deleted, it is used",
      success: false,
    };
  }

  try {
    await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Successfully deleted Activity Type",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete Activity Type: ${error}`,
      success: false,
    };
  }
};
