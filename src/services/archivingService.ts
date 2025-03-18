"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { subDays } from "date-fns";
// import { archiveToDo } from "./todo/archiveTodo";
import { archiveTask } from "./task/archiveTask";
import { archiveHabit } from "./habit/archiveHabits";

async function trackFunctionExecution(functionName: string) {
  try {
    await prisma.functionExecution.upsert({
      where: {
        name: functionName,
      },
      update: {
        lastRun: new Date(),
      },
      create: {
        name: functionName,
        lastRun: new Date(),
      },
    });
  } catch (error) {
    console.error(`Failed to track function execution: ${error}`);
  }
}

export async function getLastExecutionTime(functionName: string) {
  try {
    const execution = await prisma.functionExecution.findUnique({
      where: {
        name: functionName,
      },
    });
    return execution?.lastRun;
  } catch (error) {
    console.error(`Failed to get last execution time: ${error}`);
    return null;
  }
}

export async function archiveOutdatedEntities() {
  logService("archiveOutdatedEntities");

  try {
    const lastRun = await getLastExecutionTime("archiveOutdatedEntities");
    const minimumInterval = 1000 * 60 * 60 * 24; // 24 hours

    if (lastRun && Date.now() - lastRun.getTime() < minimumInterval) {
      return {
        message: "Archive check was performed recently",
        success: true,
        archivedCount: {
          // todos: 0,
          tasks: 0,
          habits: 0,
        },
      };
    }

    const fourteenDaysAgo = subDays(new Date(), 14);

    // // Get all outdated todos
    // const outdatedTodos = await prisma.toDo.findMany({
    //   where: {
    //     endDate: {
    //       lt: fourteenDaysAgo,
    //     },
    //   },
    // });

    // Get all outdated tasks
    const outdatedTasks = await prisma.task.findMany({
      where: {
        endDate: {
          lt: fourteenDaysAgo,
        },
      },
    });

    // Get all outdated habits
    const outdatedHabits = await prisma.habit.findMany({
      where: {
        endDate: {
          lt: fourteenDaysAgo,
        },
      },
    });

    // Archive all outdated entities
    const archivePromises = [
      // ...outdatedTodos.map((todo) => archiveToDo(todo.id)),
      ...outdatedTasks.map((task) => archiveTask(task.id)),
      ...outdatedHabits.map((habit) => archiveHabit(habit.id)),
    ];

    await Promise.all(archivePromises);
    await trackFunctionExecution("archiveOutdatedEntities");

    return {
      message: "Successfully archived outdated entities",
      success: true,
      archivedCount: {
        // todos: outdatedTodos.length,
        tasks: outdatedTasks.length,
        habits: outdatedHabits.length,
      },
    };
  } catch (error) {
    return {
      message: `Failed to archive outdated entities: ${error}`,
      success: false,
    };
  }
}

export async function getArchiveStats(userId: string) {
  logService("getArchiveStats");
  try {
    const [archivedTodos, archivedTasks, archivedHabits] = await Promise.all([
      prisma.archivedToDo.count({
        where: { userId },
      }),
      prisma.archivedTask.count({
        where: { userId },
      }),
      prisma.archivedHabit.count({
        where: { userId },
      }),
    ]);

    return {
      message: "Successfully fetched archive stats",
      success: true,
      stats: {
        todos: archivedTodos,
        tasks: archivedTasks,
        habits: archivedHabits,
        total: archivedTodos + archivedTasks + archivedHabits,
      },
    };
  } catch (error) {
    return {
      message: `Failed to fetch archive stats: ${error}`,
      success: false,
    };
  }
}
