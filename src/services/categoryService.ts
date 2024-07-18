"use server";

import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export const createCategory = async (newCategory: Category) => {
  if (!newCategory || !newCategory.name) {
    return {
      message: "Category name is required",
      success: false,
    };
  }
  try {
    await prisma.category.create({
      data: newCategory,
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
