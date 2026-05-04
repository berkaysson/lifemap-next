import { checkIsProjectExistByProjectName } from "@/helpers/project";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    project: {
      findFirst: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("project helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkIsProjectExistByProjectName", () => {
    it("should return true if project exists with same name for user", async () => {
      (prismaMock.project.findFirst as jest.Mock).mockResolvedValue({ id: "p1", name: "Project X" });
      const exists = await checkIsProjectExistByProjectName("Project X", "u1");
      expect(exists).toBe(true);
      expect(prismaMock.project.findFirst).toHaveBeenCalledWith({
        where: { name: "Project X", userId: "u1", NOT: { id: undefined } },
      });
    });

    it("should exclude current project when projectId is provided", async () => {
      (prismaMock.project.findFirst as jest.Mock).mockResolvedValue(null);
      const exists = await checkIsProjectExistByProjectName("Project X", "u1", "p1");
      expect(exists).toBe(false);
      expect(prismaMock.project.findFirst).toHaveBeenCalledWith({
        where: { name: "Project X", userId: "u1", NOT: { id: "p1" } },
      });
    });

    it("should return false if project does not exist", async () => {
      (prismaMock.project.findFirst as jest.Mock).mockResolvedValue(null);
      const exists = await checkIsProjectExistByProjectName("Project Y", "u1");
      expect(exists).toBe(false);
    });
  });
});
