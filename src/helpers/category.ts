import prisma from "@/lib/prisma";

export const checkIsCategoryExistsByCategoryId = async (
  categoryId: string,
  userId: string
) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) return false;
  return true;
};

export const checkIsCategoryExistByCategoryName = async (
  categoryName: string,
  userId: string
) => {
  const category = await prisma.category.findFirst({
    where: { name: categoryName, userId },
  });
  if (!category) return false;
  return true;
};

export const checkIsCategoryUsed = async (categoryId: string) => {
  const activitiesInCategory = await prisma.activity.findMany({
    where: {
      categoryId,
    },
  });

  if (activitiesInCategory.length > 0) {
    return false;
  }

  const tasksInCategory = await prisma.task.findMany({
    where: {
      categoryId,
    },
  });

  if (tasksInCategory.length > 0) {
    return false;
  }

  const habitsInCategory = await prisma.habit.findMany({
    where: {
      categoryId,
    },
  });

  if (habitsInCategory.length > 0) {
    return false;
  }

  return true;
};
