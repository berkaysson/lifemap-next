import {
  calculateTotalDurationForDateRange,
  calculateStreaks,
  validateHabitPeriodAndDate,
  calculateIsHabitCompleted,
  calculateProgress,
  updateHabitCompleted,
  updateHabitsCompletedDurationByActivityDate,
} from "@/helpers/habit";
import { Habit, HabitProgress } from "@prisma/client";
import { addDays, addYears } from "date-fns";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    habitProgress: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    habit: {
      update: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("habit helpers", () => {
  describe("calculateTotalDurationForDateRange", () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-03");

    it("should sum durations of activities within the date range", () => {
      const activities = [
        { date: new Date("2024-01-01"), duration: 10 },
        { date: new Date("2024-01-02"), duration: 20 },
        { date: new Date("2024-01-03"), duration: 30 },
      ];
      expect(
        calculateTotalDurationForDateRange(activities, startDate, endDate),
      ).toBe(60);
    });

    it("should ignore activities outside the date range", () => {
      const activities = [
        { date: new Date("2023-12-31"), duration: 100 },
        { date: new Date("2024-01-01"), duration: 10 },
        { date: new Date("2024-01-04"), duration: 100 },
      ];
      expect(
        calculateTotalDurationForDateRange(activities, startDate, endDate),
      ).toBe(10);
    });

    it("should return 0 if activities list is empty", () => {
      expect(calculateTotalDurationForDateRange([], startDate, endDate)).toBe(
        0,
      );
    });

    it("should handle boundary conditions correctly", () => {
      const activities = [
        { date: startDate, duration: 5 },
        { date: endDate, duration: 5 },
      ];
      expect(
        calculateTotalDurationForDateRange(activities, startDate, endDate),
      ).toBe(10);
    });
  });

  describe("calculateStreaks", () => {
    const createProgress = (completed: boolean) =>
      ({ completed }) as HabitProgress;

    it("should calculate correct streaks for all completed", async () => {
      const progresses = [
        createProgress(true),
        createProgress(true),
        createProgress(true),
      ];
      const result = await calculateStreaks(progresses);
      expect(result.currentStreak).toBe(3);
      expect(result.bestStreak).toBe(3);
    });

    it("should calculate correct streaks for mixed completion", async () => {
      const progresses = [
        createProgress(true),
        createProgress(true),
        createProgress(false),
        createProgress(true),
      ];
      const result = await calculateStreaks(progresses);
      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(2);
    });

    it("should return 0 streaks if none are completed", async () => {
      const progresses = [createProgress(false), createProgress(false)];
      const result = await calculateStreaks(progresses);
      expect(result.currentStreak).toBe(0);
      expect(result.bestStreak).toBe(0);
    });

    it("should handle current streak being the best streak", async () => {
      const progresses = [
        createProgress(true),
        createProgress(false),
        createProgress(true),
        createProgress(true),
        createProgress(true),
      ];
      const result = await calculateStreaks(progresses);
      expect(result.currentStreak).toBe(3);
      expect(result.bestStreak).toBe(3);
    });

    it("should handle best streak being in the past", async () => {
      const progresses = [
        createProgress(true),
        createProgress(true),
        createProgress(true),
        createProgress(false),
        createProgress(true),
      ];
      const result = await calculateStreaks(progresses);
      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(3);
    });
  });

  describe("validateHabitPeriodAndDate", () => {
    const startDate = new Date();
    const endDate = addDays(startDate, 10);

    it("should fail if numberOfPeriods is less than 2", () => {
      const result = validateHabitPeriodAndDate(1, startDate, endDate);
      expect(result.success).toBe(false);
      expect(result.message).toContain("at least 2");
    });

    it("should fail if numberOfPeriods is more than 90", () => {
      const result = validateHabitPeriodAndDate(91, startDate, endDate);
      expect(result.success).toBe(false);
      expect(result.message).toContain("cannot exceed 90");
    });

    it("should fail if endDate is more than 1 year from startDate", () => {
      const wayInFuture = addYears(startDate, 2);
      const result = validateHabitPeriodAndDate(10, startDate, wayInFuture);
      expect(result.success).toBe(false);
      expect(result.message).toContain("more than 1 year");
    });

    it("should pass for valid parameters", () => {
      const result = validateHabitPeriodAndDate(10, startDate, endDate);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Habit creation is valid.");
    });
  });

  describe("calculateIsHabitCompleted", () => {
    const createProgress = (completed: boolean) =>
      ({ completed }) as HabitProgress;

    it("should return true if all progresses are completed", async () => {
      const progresses = [
        createProgress(true),
        createProgress(true),
        createProgress(true),
      ];
      const result = await calculateIsHabitCompleted(progresses);
      expect(result).toBe(true);
    });

    it("should return false if at least one progress is not completed", async () => {
      const progresses = [
        createProgress(true),
        createProgress(false),
        createProgress(true),
      ];
      const result = await calculateIsHabitCompleted(progresses);
      expect(result).toBe(false);
    });

    it("should return true for an empty array", async () => {
      const result = await calculateIsHabitCompleted([]);
      expect(result).toBe(true);
    });
  });

  describe("calculateProgress", () => {
    const habit = {
      id: "h1",
      userId: "u1",
      categoryId: "c1",
      period: "DAILY",
      goalDurationPerPeriod: 60,
    } as Habit;

    it("should calculate progress correctly for a completed period", async () => {
      const currentDate = new Date("2024-01-01");
      const activities = [{ date: new Date("2024-01-01"), duration: 60 }];

      const result = await calculateProgress(habit, currentDate, 1, activities);

      expect(result.order).toBe(1);
      expect(result.completed).toBe(true);
      expect(result.completedDuration).toBe(60);
      expect(result.startDate).toEqual(currentDate);
      expect(result.endDate).toEqual(currentDate); // DAILY: add 1 day, then remove 1 day -> same day
    });

    it("should calculate progress correctly for a non-completed period", async () => {
      const currentDate = new Date("2024-01-01");
      const activities = [{ date: new Date("2024-01-01"), duration: 30 }];

      const result = await calculateProgress(habit, currentDate, 2, activities);

      expect(result.order).toBe(2);
      expect(result.completed).toBe(false);
      expect(result.completedDuration).toBe(30);
    });

    it("should handle WEEKLY period correctly with boundary activities", async () => {
      const weeklyHabit = { ...habit, period: "WEEKLY" } as Habit;
      const currentDate = new Date("2024-01-01"); // Monday
      const activities = [
        { date: new Date("2023-12-31"), duration: 100 }, // Day before (Sunday) - Exclude
        { date: new Date("2024-01-01"), duration: 30 },  // First day (Monday) - Include
        { date: new Date("2024-01-07"), duration: 30 },  // Last day (Sunday) - Include
        { date: new Date("2024-01-08"), duration: 100 }, // Day after (Monday) - Exclude
      ];

      const result = await calculateProgress(
        weeklyHabit,
        currentDate,
        1,
        activities,
      );

      expect(result.completed).toBe(true);
      expect(result.completedDuration).toBe(60);
      expect(result.endDate).toEqual(new Date("2024-01-07"));
    });

    it("should handle MONTHLY period correctly with boundary activities", async () => {
      const monthlyHabit = { ...habit, period: "MONTHLY" } as Habit;
      const currentDate = new Date("2024-01-01");
      const activities = [
        { date: new Date("2023-12-31"), duration: 100 }, // Day before - Exclude
        { date: new Date("2024-01-01"), duration: 20 },  // First day - Include
        { date: new Date("2024-01-31"), duration: 40 },  // Last day - Include
        { date: new Date("2024-02-01"), duration: 100 }, // Day after - Exclude
      ];

      const result = await calculateProgress(
        monthlyHabit,
        currentDate,
        1,
        activities,
      );

      expect(result.completed).toBe(true);
      expect(result.completedDuration).toBe(60);
      expect(result.endDate).toEqual(new Date("2024-01-31"));
    });
  });

  describe("updateHabitCompleted", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update habit completion and streaks", async () => {
      const habitId = "h1";
      const progresses = [
        { completed: true } as HabitProgress,
        { completed: true } as HabitProgress,
      ];
      (prismaMock.habitProgress.findMany as jest.Mock).mockResolvedValue(
        progresses,
      );
      (prismaMock.habit.update as jest.Mock).mockResolvedValue({});

      await updateHabitCompleted(habitId);

      expect(prismaMock.habitProgress.findMany).toHaveBeenCalledWith({
        where: { habitId },
      });
      expect(prismaMock.habit.update).toHaveBeenCalledWith({
        where: { id: habitId },
        data: { completed: true, currentStreak: 2, bestStreak: 2 },
      });
    });
  });

  describe("updateHabitsCompletedDurationByActivityDate", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update progress and return newly completed count", async () => {
      const userId = "u1";
      const categoryId = "c1";
      const activityDate = new Date("2024-01-01");
      const duration = 30;

      const progresses = [
        {
          id: "hp1",
          habitId: "h1",
          completed: false,
          completedDuration: 30,
          goalDuration: 60,
          habit: { id: "h1" },
        },
        {
          id: "hp2",
          habitId: "h2",
          completed: true,
          completedDuration: 60,
          goalDuration: 60,
          habit: { id: "h2" },
        },
      ] as any[];

      (prismaMock.habitProgress.findMany as jest.Mock).mockResolvedValue(
        progresses,
      );
      (prismaMock.habitProgress.update as jest.Mock).mockResolvedValue({});
      (prismaMock.habit.update as jest.Mock).mockResolvedValue({});

      const newlyCompletedCount =
        await updateHabitsCompletedDurationByActivityDate(
          userId,
          categoryId,
          activityDate,
          duration,
        );

      expect(newlyCompletedCount).toBe(1); // hp1 becomes completed
      expect(prismaMock.habitProgress.update).toHaveBeenCalledWith({
        where: { id: "hp1" },
        data: { completedDuration: 60, completed: true },
      });
      expect(prismaMock.habitProgress.update).toHaveBeenCalledWith({
        where: { id: "hp2" },
        data: { completedDuration: 90, completed: true },
      });
      // Verify that habit updates are triggered
      expect(prismaMock.habit.update).toHaveBeenCalled();
    });
  });
});
