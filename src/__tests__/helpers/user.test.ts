import { getUserByEmail, getUserById } from "@/helpers/user";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("user helpers", () => {
  const mockUser = {
    id: "u1",
    email: "test@example.com",
    name: "Test User",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserByEmail", () => {
    it("should return the user if found", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await getUserByEmail("test@example.com");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(user).toEqual(mockUser);
    });

    it("should return null if user is not found", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await getUserByEmail("notfound@example.com");

      expect(user).toBeNull();
    });

    it("should return null if an error occurs", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));

      const user = await getUserByEmail("test@example.com");

      expect(user).toBeNull();
    });
  });

  describe("getUserById", () => {
    it("should return the user if found", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await getUserById("u1");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "u1" },
      });
      expect(user).toEqual(mockUser);
    });

    it("should return null if user is not found", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await getUserById("u2");

      expect(user).toBeNull();
    });

    it("should return null if an error occurs", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));

      const user = await getUserById("u1");

      expect(user).toBeNull();
    });
  });
});
