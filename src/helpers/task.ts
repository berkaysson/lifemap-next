import prisma from "@/lib/prisma";

export const updateTasksCompletedDurationByActivityDate = async (
  userId: string,
  categoryId: string,
  activityDate: Date,
  duration: number
) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      categoryId,
      startDate: { lte: activityDate },
      endDate: { gte: activityDate },
    },
  });

  for (const task of tasks) {
    const newCompletedDuration = task.completedDuration + duration;
    const completed = newCompletedDuration >= task.goalDuration;

    await prisma.task.update({
      where: { id: task.id },
      data: {
        completedDuration: newCompletedDuration,
        completed,
      },
    });
  }
};
