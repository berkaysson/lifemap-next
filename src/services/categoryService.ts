"use server";

import {
  checkIsCategoryExistByCategoryName,
  checkIsCategoryUsed,
} from "@/data/category";
import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { CategorySchema } from "@/schema";
import { Category } from "@prisma/client";
import { z } from "zod";

export const createCategory = async (
  newCategory: z.infer<typeof CategorySchema>,
  userId: string
) => {
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

export const getCategories = async (userId: string) => {
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    });
    return {
      message: "Successfully fetched categories",
      success: true,
      categories,
    };
  } catch (error) {
    return {
      message: `Failed to fetch categories: ${error}`,
      success: false,
    };
  }
};

export const updateCategory = async (data: Category) => {
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

export const deleteCategory = async (id: string) => {
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  const canBeDeleted = await checkIsCategoryUsed(id);

  if (!canBeDeleted) {
    return {
      message: "Category cannot be deleted, it is used",
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
      message: "Successfully deleted category",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete category: ${error}`,
      success: false,
    };
  }
};
