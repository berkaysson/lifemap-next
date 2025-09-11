"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { createHabit } from "@/services/habit/createHabit";

export const seedDefaultStarter = async (userId: string) => {
  try {
    // Idempotency guard: skip if already seeded for this user
    const executionName = `seed-default-starter:${userId}`;
    const existingExecution = await prisma.functionExecution.findUnique({
      where: { name: executionName },
    });

    if (existingExecution) {
      return {
        message: "Default starter already seeded",
        success: true,
      };
    }

    await seedDefaultCategories(userId);
    await seedDefaultTodos(userId);
    await seedDefaultTasks(userId);
    await seedDefaultHabits(userId);

    // Mark as seeded
    await prisma.functionExecution.create({
      data: { name: executionName },
    });

    return {
      message: "Successfully seeded default starter",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to seed default starter: ${error}`,
      success: false,
    };
  }
};

const seedDefaultCategories = async (userId: string) => {
  try {
    const defaultCategories = ["Finishing the Book", "Walking Morning"];
    const date = parseDate(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');

    await Promise.all(
      defaultCategories.map((name) =>
        prisma.category.create({
          data: {
            name,
            date,
            userId,
          },
        })
      )
    );

    return {
      message: "Successfully seeded default Activity Types",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to seed default Activity Types: ${error}`,
      success: false,
    };
  }
};

const seedDefaultTodos = async (userId: string) => {
  try {
    const defaultTodos = [
      {
        name: "Set up your first habit",
        description:
          "Create a daily, weekly, or monthly habit to track in any Activity Type.",
      },
      {
        name: "Add a task with duration",
        description:
          "Tasks help you track time-based goals like studying or exercising.",
      },
      {
        name: "Create your first project",
        description:
          "Projects help organize related habits, tasks, and todos together.",
      },
    ];

    const startDate = parseDate(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');

    await Promise.all(
      defaultTodos.map((todo) =>
        prisma.toDo.create({
          data: {
            ...todo,
            completed: false,
            startDate,
            userId,
            projectId: undefined,
          },
        })
      )
    );

    return {
      message: "Successfully seeded default todos",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to seed default todos: ${error}`,
      success: false,
    };
  }
};

const seedDefaultTasks = async (userId: string) => {
  try {
    const bookCategory = await prisma.category.findFirst({
      where: {
        name: "Finishing the Book",
        userId,
      },
    });

    if (!bookCategory) {
      return {
        message: "Default Activity Type not found",
        success: false,
      };
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    endDate.setHours(0, 0, 0, 0);

    await prisma.task.create({
      data: {
        name: "I want to finish my book in 30 days",
        description: "Complete 300 minutes of reading over the next 30 days",
        colorCode: "#4B0082",
        goalDuration: 300,
        completed: false,
        completedDuration: 0,
        startDate: parseDate(startDate.toISOString()),
        endDate: parseDate(endDate.toISOString()),
        userId,
        categoryId: bookCategory.id,
      },
    });

    return {
      message: "Successfully seeded default task",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to seed default task: ${error}`,
      success: false,
    };
  }
};

const seedDefaultHabits = async (userId: string) => {
  try {
    const walkingCategory = await prisma.category.findFirst({
      where: {
        name: "Walking Morning",
        userId,
      },
    });

    if (!walkingCategory) {
      return {
        message: "Default walking Activity Type not found",
        success: false,
      };
    }

    const startDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

    const newHabit = {
      name: "Morning Walk",
      description: "Walk for 30 minutes every morning to start your day fresh",
      colorCode: "#2E8B57",
      period: "DAILY" as const,
      numberOfPeriods: 30,
      startDate: startDate,
      goalDurationPerPeriod: 30,
      categoryId: walkingCategory.id,
      projectId: undefined,
    };

    const result = await createHabit(newHabit, userId);
    return result;
  } catch (error) {
    return {
      message: `Failed to seed default habit: ${error}`,
      success: false,
    };
  }
};
