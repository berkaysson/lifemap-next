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
  const activitiesInCategory = await prisma.activity.findFirst({
    where: {
      categoryId,
    },
  });

  if (activitiesInCategory) {
    return false;
  }

  const tasksInCategory = await prisma.task.findFirst({
    where: {
      categoryId,
    },
  });

  if (tasksInCategory) {
    return false;
  }

  const habitsInCategory = await prisma.habit.findFirst({
    where: {
      categoryId,
    },
  });

  if (habitsInCategory) {
    return false;
  }

  return true;
};
