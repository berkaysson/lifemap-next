"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, format } from "date-fns";
import { unstable_cache } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MonthlyKPI = {
  totalActivityMinutes: number;
  habitsCompleted: number;
  tasksCompleted: number;
  todosCompleted: number;
  notesCreated: number;
};

export type DailyActivityEntry = {
  date: string; // "YYYY-MM-DD"
  totalMinutes: number;
};

export type MonthlyHabitStat = {
  id: string;
  name: string;
  colorCode: string | null;
  completedDuration: number;
  goalDuration: number;
  completionRate: number; // 0–100
};

export type MonthlyTaskStat = {
  id: string;
  name: string;
  colorCode: string | null;
  completedDuration: number;
  goalDuration: number;
};

export type DailyTodoEntry = {
  date: string; // "YYYY-MM-DD"
  cumulativeCompleted: number;
};

export type MonthlyReportData = {
  kpi: MonthlyKPI;
  dailyActivity: DailyActivityEntry[];
  habitStats: MonthlyHabitStat[];
  taskStats: MonthlyTaskStat[];
  todoTimeline: DailyTodoEntry[];
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const getMonthlyReport = async (
  userId: string,
  year: number,
  month: number, // 1-indexed
) => {
  logService("getMonthlyReport");

  if (!userId) {
    return { message: "userId is required", success: false, data: null };
  }

  const fetchReport = unstable_cache(
    async (userId: string, year: number, month: number) => {
      logService("getMonthlyReport - calculate");
      try {
        const referenceDate = new Date(year, month - 1, 1);
        const startDate = startOfDay(startOfMonth(referenceDate));
        const endDate = endOfDay(endOfMonth(referenceDate));

        // ── Parallel fetches ────────────────────────────────────────────────
        const [activities, habitProgressRecords, tasks, todos, notes] =
          await Promise.all([
            // Activities in this month
            prisma.activity.findMany({
              where: { userId, date: { gte: startDate, lte: endDate } },
              orderBy: { date: "asc" },
            }),

            // HabitProgress periods that overlap this month
            prisma.habitProgress.findMany({
              where: {
                userId,
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              include: {
                habit: { select: { name: true, colorCode: true } },
              },
            }),

            // Tasks that overlap this month
            prisma.task.findMany({
              where: {
                userId,
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              select: {
                id: true,
                name: true,
                colorCode: true,
                completedDuration: true,
                goalDuration: true,
                completed: true,
              },
            }),

            // Todos completed within this month
            prisma.toDo.findMany({
              where: {
                userId,
                completed: true,
                endDate: { gte: startDate, lte: endDate },
              },
              select: { endDate: true },
              orderBy: { endDate: "asc" },
            }),

            // Notes created this month
            prisma.note.count({
              where: {
                userId,
                createdAt: { gte: startDate, lte: endDate },
              },
            }),
          ]);

        // ── KPI ─────────────────────────────────────────────────────────────
        const totalActivityMinutes = activities.reduce(
          (sum, a) => sum + a.duration,
          0,
        );
        const habitsCompleted = habitProgressRecords.filter(
          (hp) => hp.completed,
        ).length;
        const tasksCompleted = tasks.filter((t) => t.completed).length;
        const todosCompleted = todos.length;

        const kpi: MonthlyKPI = {
          totalActivityMinutes,
          habitsCompleted,
          tasksCompleted,
          todosCompleted,
          notesCreated: notes,
        };

        // ── Daily Activity Heatmap ──────────────────────────────────────────
        const dailyMap = new Map<string, number>();
        for (const activity of activities) {
          const key = format(activity.date, "yyyy-MM-dd");
          dailyMap.set(key, (dailyMap.get(key) ?? 0) + activity.duration);
        }
        const dailyActivity: DailyActivityEntry[] = Array.from(
          dailyMap.entries(),
        ).map(([date, totalMinutes]) => ({ date, totalMinutes }));

        // ── Habit Stats ─────────────────────────────────────────────────────
        // Aggregate by habit (a habit can have multiple progress periods)
        const habitMap = new Map<
          string,
          {
            name: string;
            colorCode: string | null;
            completedDuration: number;
            goalDuration: number;
          }
        >();

        for (const hp of habitProgressRecords) {
          const existing = habitMap.get(hp.habitId);
          if (existing) {
            existing.completedDuration += hp.completedDuration;
            existing.goalDuration += hp.goalDuration;
          } else {
            habitMap.set(hp.habitId, {
              name: hp.habit.name,
              colorCode: hp.habit.colorCode,
              completedDuration: hp.completedDuration,
              goalDuration: hp.goalDuration,
            });
          }
        }

        const habitStats: MonthlyHabitStat[] = Array.from(
          habitMap.entries(),
        ).map(([id, data]) => ({
          id,
          name: data.name,
          colorCode: data.colorCode,
          completedDuration: data.completedDuration,
          goalDuration: data.goalDuration,
          completionRate:
            data.goalDuration > 0
              ? Math.min(
                  100,
                  Math.round((data.completedDuration / data.goalDuration) * 100),
                )
              : 0,
        }));

        // ── Task Stats ──────────────────────────────────────────────────────
        const taskStats: MonthlyTaskStat[] = tasks.map((t) => ({
          id: t.id,
          name: t.name,
          colorCode: t.colorCode,
          completedDuration: t.completedDuration,
          goalDuration: t.goalDuration,
        }));

        // ── Todo Timeline (cumulative) ──────────────────────────────────────
        const todoDailyMap = new Map<string, number>();
        for (const todo of todos) {
          if (!todo.endDate) continue;
          const key = format(todo.endDate, "yyyy-MM-dd");
          todoDailyMap.set(key, (todoDailyMap.get(key) ?? 0) + 1);
        }

        let cumulative = 0;
        const todoTimeline: DailyTodoEntry[] = Array.from(
          todoDailyMap.entries(),
        )
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => {
            cumulative += count;
            return { date, cumulativeCompleted: cumulative };
          });

        return {
          message: "Successfully fetched monthly report",
          success: true,
          data: {
            kpi,
            dailyActivity,
            habitStats,
            taskStats,
            todoTimeline,
          } satisfies MonthlyReportData,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to fetch monthly report: ${errorMessage}`);
        return {
          message: `Failed to fetch monthly report: ${errorMessage}`,
          success: false,
          data: null,
        };
      }
    },
    [`monthly-report-${userId}-${year}-${month}`],
    {
      tags: [
        `activities-${userId}`,
        `habits-${userId}`,
        `tasks-${userId}`,
        `todos-${userId}`,
        `notes-${userId}`,
        "activities",
        "habits",
        "tasks",
      ],
      revalidate: 3600,
    },
  );

  return fetchReport(userId, year, month);
};
