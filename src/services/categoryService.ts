"use server";

import prisma from "@/lib/prisma";
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

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      name: newCategory.name,
      userId,
    },
  });

  if (isCategoryExist) {
    return {
      message: "Category already exists",
      success: false,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: newCategory.name,
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

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      name: data.name,
      userId: data.userId,
      NOT: {
        id: data.id,
      },
    },
  });

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

  const canBeDeleted = await checkCategoryCanBeDeleted(id);

  if (!canBeDeleted) {
    return {
      message: "Category cannot be deleted, it used in activities or tasks",
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

const checkCategoryCanBeDeleted = async (id: string) => {
  const activitiesInCategory = await prisma.activity.findMany({
    where: {
      categoryId: id,
    },
  });

  if (activitiesInCategory.length > 0) {
    return false;
  }

  const tasksInCategory = await prisma.task.findMany({
    where: {
      categoryId: id,
    },
  });

  if (tasksInCategory.length > 0) {
    return false;
  }

  // add habit check later

  return true;
};
