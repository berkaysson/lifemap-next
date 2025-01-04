"use server";

import { checkIsCategoryExistByCategoryName } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { Category } from "@prisma/client";

export const updateCategory = async (data: Category) => {
  logService("updateCategory");
  if (!data || !data.name || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  const isCategoryExist = await checkIsCategoryExistByCategoryName(
    data.name,
    data.userId
  );

  if (isCategoryExist) {
    return {
      message: "Category already exists",
      success: false,
    };
  }

  try {
    await prisma.category.update({
      where: {
        id: data.id,
      },
      data: data,
    });
    return {
      message: "Successfully updated category",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to update category: ${error}`,
      success: false,
    };
  }
};
