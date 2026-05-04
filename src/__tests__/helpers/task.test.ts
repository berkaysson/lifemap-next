import { updateTasksCompletedDurationByActivityDate } from "@/helpers/task";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    task: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("task helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateTasksCompletedDurationByActivityDate", () => {
    const userId = "u1";
    const categoryId = "c1";
    const activityDate = new Date("2024-01-01");
    const duration = 30;

    it("should return 0 and do nothing if no tasks are found in the date range", async () => {
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([]);
      
      const result = await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        duration
      );
      
      expect(result).toBe(0);
      expect(prismaMock.task.update).not.toHaveBeenCalled();
    });

    it("should correctly identify and update a newly completed task", async () => {
      const task = {
        id: "t1",
        completed: false,
        completedDuration: 30,
        goalDuration: 60,
      };
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([task]);
      (prismaMock.task.update as jest.Mock).mockResolvedValue({});

      const result = await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        duration
      );

      expect(result).toBe(1);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: "t1" },
        data: { completedDuration: 60, completed: true },
      });
    });

    it("should update duration but not count already completed tasks in newlyCompletedCount", async () => {
      const task = {
        id: "t1",
        completed: true,
        completedDuration: 60,
        goalDuration: 60,
      };
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([task]);
      (prismaMock.task.update as jest.Mock).mockResolvedValue({});

      const result = await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        duration
      );

      expect(result).toBe(0);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: "t1" },
        data: { completedDuration: 90, completed: true },
      });
    });

    it("should handle multiple tasks with different states simultaneously", async () => {
      const tasks = [
        { id: "t1", completed: false, completedDuration: 30, goalDuration: 60 }, // Newly completed (30+30=60)
        { id: "t2", completed: false, completedDuration: 10, goalDuration: 60 }, // Still in progress (10+30=40)
        { id: "t3", completed: true, completedDuration: 60, goalDuration: 60 },  // Already completed, just increasing duration
      ];
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue(tasks);
      (prismaMock.task.update as jest.Mock).mockResolvedValue({});

      const result = await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        duration
      );

      expect(result).toBe(1); // Only t1 newly completed
      expect(prismaMock.task.update).toHaveBeenCalledTimes(3);
      
      // Detailed check for t2
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: "t2" },
        data: { completedDuration: 40, completed: false },
      });
    });

    it("should skip update if duration increment is 0 and status remains unchanged", async () => {
       const task = { id: "t1", completed: true, completedDuration: 60, goalDuration: 60 };
       (prismaMock.task.findMany as jest.Mock).mockResolvedValue([task]);
       
       const result = await updateTasksCompletedDurationByActivityDate(
         userId, 
         categoryId, 
         activityDate, 
         0
       );
       
       expect(result).toBe(0);
       expect(prismaMock.task.update).not.toHaveBeenCalled();
    });

    it("should use correct filtering in findMany to fetch tasks active on activityDate", async () => {
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([]);
      
      await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        duration
      );

      expect(prismaMock.task.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          categoryId,
          startDate: { lte: activityDate },
          endDate: { gte: activityDate },
        },
      });
    });

    it("should handle the boundary case where new duration exactly matches goalDuration", async () => {
      const task = {
        id: "t_boundary",
        completed: false,
        completedDuration: 59.5,
        goalDuration: 60,
      };
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([task]);
      (prismaMock.task.update as jest.Mock).mockResolvedValue({});

      const result = await updateTasksCompletedDurationByActivityDate(
        userId, 
        categoryId, 
        activityDate, 
        0.5
      );

      expect(result).toBe(1);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: "t_boundary" },
        data: { completedDuration: 60, completed: true },
      });
    });
  });
});
