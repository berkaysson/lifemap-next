import prisma from "@/lib/prisma";

export const getActivityDuration = async (activityId: string) => {
  const oldActivity = await prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });

  return oldActivity?.duration;
};

export const getActivityById = async (activityId: string) => {
  const activity = await prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });

  return activity;
};

export const getActivitiesTotalDurationBetweenDates = async (
  userId: string,
  categoryId: string,
  startDate: Date,
  endDate: Date
) => {
  const activities = await prisma.activity.findMany({
    where: {
      userId,
      categoryId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (activities.length === 0) {
    return 0;
  }

  const totalDuration = activities
    .map((activity) => activity.duration)
    .reduce((total, duration) => total + duration, 0);

  return totalDuration;
};
