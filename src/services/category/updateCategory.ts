"use server";

import { checkIsCategoryExistByCategoryName } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { Category } from "@prisma/client";
import { revalidateTag } from "next/cache";

export const updateCategory = async (data: Category) => {
  logService("updateCategory");
  if (!data || !data.name || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  const existingCategoryWithSameName = await prisma.category.findFirst({
    where: {
      name: data.name,
      userId: data.userId,
      id: { not: data.id },
    },
  });
  
  if (existingCategoryWithSameName) {
    return {
      message: "Activity Type already exists",
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

    revalidateTag("activities");
    revalidateTag(`activities-${data.userId}`);

    return {
      message: "Successfully updated Activity Type",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to update Activity Type: ${error}`,
      success: false,
    };
  }
};
