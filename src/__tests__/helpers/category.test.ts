import {
  checkIsCategoryExistsByCategoryId,
  checkIsCategoryExistByCategoryName,
  checkIsCategoryUsed,
} from "@/helpers/category";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    category: {
      findFirst: jest.fn(),
    },
    activity: {
      findFirst: jest.fn(),
    },
    task: {
      findFirst: jest.fn(),
    },
    habit: {
      findFirst: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("category helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkIsCategoryExistsByCategoryId", () => {
    it("should return true if category exists", async () => {
      (prismaMock.category.findFirst as jest.Mock).mockResolvedValue({ id: "c1" });
      const exists = await checkIsCategoryExistsByCategoryId("c1", "u1");
      expect(exists).toBe(true);
      expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
        where: { id: "c1", userId: "u1" },
      });
    });

    it("should return false if category does not exist", async () => {
      (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(null);
      const exists = await checkIsCategoryExistsByCategoryId("c1", "u1");
      expect(exists).toBe(false);
    });
  });

  describe("checkIsCategoryExistByCategoryName", () => {
    it("should return true if category name exists for user", async () => {
      (prismaMock.category.findFirst as jest.Mock).mockResolvedValue({ name: "Work" });
      const exists = await checkIsCategoryExistByCategoryName("Work", "u1");
      expect(exists).toBe(true);
      expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
        where: { name: "Work", userId: "u1" },
      });
    });

    it("should return false if category name does not exist", async () => {
      (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(null);
      const exists = await checkIsCategoryExistByCategoryName("Work", "u1");
      expect(exists).toBe(false);
    });
  });

  describe("checkIsCategoryUsed", () => {
    it("should return false if category has activities", async () => {
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue({ id: "a1" });
      const isUsed = await checkIsCategoryUsed("c1");
      expect(isUsed).toBe(false);
      expect(prismaMock.activity.findFirst).toHaveBeenCalledWith({
        where: { categoryId: "c1" },
      });
    });

    it("should return false if category has tasks", async () => {
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.task.findFirst as jest.Mock).mockResolvedValue({ id: "t1" });
      const isUsed = await checkIsCategoryUsed("c1");
      expect(isUsed).toBe(false);
      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: { categoryId: "c1" },
      });
    });

    it("should return false if category has habits", async () => {
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.task.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.habit.findFirst as jest.Mock).mockResolvedValue({ id: "h1" });
      const isUsed = await checkIsCategoryUsed("c1");
      expect(isUsed).toBe(false);
      expect(prismaMock.habit.findFirst).toHaveBeenCalledWith({
        where: { categoryId: "c1" },
      });
    });

    it("should return true if category is not used in anything", async () => {
      (prismaMock.activity.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.task.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.habit.findFirst as jest.Mock).mockResolvedValue(null);
      const isUsed = await checkIsCategoryUsed("c1");
      expect(isUsed).toBe(true);
    });
  });
});
