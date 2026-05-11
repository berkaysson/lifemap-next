"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export const getCategories = async (
  userId: string,
  sortByLastUsed: boolean = false
) => {
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
      include: sortByLastUsed
        ? {
            activities: {
              orderBy: {
                date: "desc",
              },
              take: 1,
            },
          }
        : undefined,
    });

    if (sortByLastUsed) {
      (categories as any[]).sort((a, b) => {
        const dateA = a.activities?.[0]?.date?.getTime() || 0;
        const dateB = b.activities?.[0]?.date?.getTime() || 0;
        return dateB - dateA;
      });
    }

    return {
      message: "Successfully fetched Activity Types",
      success: true,
      categories,
    };
  } catch (error) {
    return {
      message: `Failed to fetch Activity Types: ${error}`,
      success: false,
    };
  }
};
