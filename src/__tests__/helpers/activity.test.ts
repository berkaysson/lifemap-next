import { getActivityDuration, getActivitiesTotalDurationBetweenDates } from "@/helpers/activity";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    activity: {
      findFirst: jest.fn(),
      aggregate: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("activity helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getActivityDuration", () => {
    it("should return the duration of the activity if it exists", async () => {
      const activityId = "a1";
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue({
        id: activityId,
        duration: 45,
      });

      const duration = await getActivityDuration(activityId);

      expect(prismaMock.activity.findFirst).toHaveBeenCalledWith({
        where: { id: activityId },
      });
      expect(duration).toBe(45);
    });

    it("should return undefined if the activity does not exist", async () => {
      const activityId = "non-existent";
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue(null);

      const duration = await getActivityDuration(activityId);

      expect(duration).toBeUndefined();
    });
  });

  describe("getActivitiesTotalDurationBetweenDates", () => {
    it("should return the sum of durations for multiple activities within the given range", async () => {
      const userId = "u1";
      const categoryId = "c1";
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-07");

      // Mocking the result of an aggregation that summed up multiple activities (e.g., 40 + 50 + 30)
      (prismaMock.activity.aggregate as jest.Mock).mockResolvedValue({
        _sum: { duration: 120 },
      });

      const totalDuration = await getActivitiesTotalDurationBetweenDates(
        userId,
        categoryId,
        startDate,
        endDate
      );

      expect(prismaMock.activity.aggregate).toHaveBeenCalledWith({
        where: {
          userId,
          categoryId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { duration: true },
      });
      expect(totalDuration).toBe(120);
    });

    it("should return 0 if no activities are found (null sum)", async () => {
      (prismaMock.activity.aggregate as jest.Mock).mockResolvedValue({
        _sum: { duration: null },
      });

      const totalDuration = await getActivitiesTotalDurationBetweenDates(
        "u1",
        "c1",
        new Date(),
        new Date()
      );

      expect(totalDuration).toBe(0);
    });
  });
});
