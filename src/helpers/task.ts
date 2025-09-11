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

  // Calculate how many tasks will newly become completed with this activity
  const newlyCompletedCount = tasks.reduce((count, task) => {
    const newCompletedDuration = task.completedDuration + duration;
    const willBeCompleted = newCompletedDuration >= task.goalDuration;
    return count + (!task.completed && willBeCompleted ? 1 : 0);
  }, 0);

  const taskUpdates = tasks
    .map((task) => {
      const newCompletedDuration = task.completedDuration + duration;
      const completed = newCompletedDuration >= task.goalDuration;

      if (
        newCompletedDuration !== task.completedDuration ||
        completed !== task.completed
      ) {
        return prisma.task.update({
          where: { id: task.id },
          data: {
            completedDuration: newCompletedDuration,
            completed,
          },
        });
      }
      return null; // If no update is needed, return null
    })
    .filter(Boolean);

  if (taskUpdates.length > 0) {
    await Promise.all(taskUpdates);
  }

  return newlyCompletedCount;
};
