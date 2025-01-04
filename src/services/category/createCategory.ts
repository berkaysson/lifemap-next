"use server";

import { checkIsCategoryExistByCategoryName } from "@/helpers/category";
import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { CategorySchema } from "@/schema";
import { z } from "zod";

export const createCategory = async (
  newCategory: z.infer<typeof CategorySchema>,
  userId: string
) => {
  logService("createCategory");
  const validatedFields = CategorySchema.safeParse(newCategory);

  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  const isCategoryExist = await checkIsCategoryExistByCategoryName(
    newCategory.name,
    userId
  );

  if (isCategoryExist) {
    return {
      message: "Category already exists",
      success: false,
    };
  }

  const date = parseDate(new Date().toISOString());

  try {
    await prisma.category.create({
      data: {
        name: newCategory.name,
        date,
        userId,
      },
    });

    return {
      message: "Successfully created category",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to create category: ${error}`,
      success: false,
    };
  }
};
