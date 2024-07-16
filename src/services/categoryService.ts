"use server";

import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export const createCategory = async (newCategory: Category) => {
  if (!newCategory || !newCategory.name) {
    throw new Error("newCategory is required");
  }
  try {
    const createdCategory = await prisma.category.create({
      data: newCategory,
    });
    return createdCategory;
  } catch (error) {
    throw new Error(`Failed to create category: ${error}`);
  }
};

export const getCategories = async (userId: string) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    });
    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error}`);
  }
};

export const updateCategory = async (data: Category) => {
  if (!data || !data.name || !data.id) {
    throw new Error("categoryId and categoryName are required");
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: data.id,
      },
      data: data,
    });
    return updatedCategory;
  } catch (error) {
    throw new Error(`Failed to update category: ${error}`);
  }
};

export const deleteCategory = async (id: string) => {
  if (!id) {
    throw new Error("id is required");
  }
  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return deletedCategory;
  } catch (error) {
    throw new Error(`Failed to delete category: ${error}`);
  }
};
