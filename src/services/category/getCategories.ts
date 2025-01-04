"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getCategories = async (userId: string) => {
  logService("getCategories");
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
