import prisma from "@/lib/prisma";

export const getActivityDuration = async (activityId: string) => {
  const oldActivity = await prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });

  return oldActivity?.duration;
};

export const getActivitiesTotalDurationBetweenDates = async (
  userId: string,
  categoryId: string,
  startDate: Date,
  endDate: Date
) => {
  const result = await prisma.activity.aggregate({
    where: {
      userId,
      categoryId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      duration: true,
    },
  });

  return result._sum.duration || 0;
};
