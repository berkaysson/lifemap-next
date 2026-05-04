import { generateVerificationToken, generateResetPasswordToken } from "@/helpers/tokens";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "@/helpers/verification-token";
import { getResetPasswordTokenByEmail } from "@/helpers/reset-password-token";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    verificationToken: {
      delete: jest.fn(),
      create: jest.fn(),
    },
    passwordResetToken: {
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/helpers/verification-token", () => ({
  getVerificationTokenByEmail: jest.fn(),
}));

jest.mock("@/helpers/reset-password-token", () => ({
  getResetPasswordTokenByEmail: jest.fn(),
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;
const uuidMock = uuid as jest.Mock;

describe("tokens helpers", () => {
  const email = "test@example.com";
  const mockToken = "mock-uuid-token";

  beforeEach(() => {
    jest.clearAllMocks();
    uuidMock.mockReturnValue(mockToken);
  });

  describe("generateVerificationToken", () => {
    it("should generate a new token and save it", async () => {
      (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(null);
      (prismaMock.verificationToken.create as jest.Mock).mockResolvedValue({
        email,
        token: mockToken,
      });

      const result = await generateVerificationToken(email);

      expect(uuidMock).toHaveBeenCalled();
      expect(prismaMock.verificationToken.create).toHaveBeenCalledWith({
        data: {
          email,
          token: mockToken,
          expires: expect.any(Date),
        },
      });
      expect(result.token).toBe(mockToken);
    });

    it("should delete existing token if it exists before creating a new one", async () => {
      const existingToken = { id: "old-id", email, token: "old-token" };
      (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(existingToken);
      (prismaMock.verificationToken.create as jest.Mock).mockResolvedValue({
        email,
        token: mockToken,
      });

      await generateVerificationToken(email);

      expect(prismaMock.verificationToken.delete).toHaveBeenCalledWith({
        where: { id: "old-id" },
      });
      expect(prismaMock.verificationToken.create).toHaveBeenCalled();
    });

    it("should set expiry to approximately 1 hour in the future", async () => {
      (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(null);
      (prismaMock.verificationToken.create as jest.Mock).mockImplementation(({ data }) => data);

      const result = await generateVerificationToken(email);
      
      const now = new Date().getTime();
      const oneHourInMs = 3600 * 1000;
      const expiryTime = result.expires.getTime();

      // Allow for a small buffer (e.g., 5 seconds) due to execution time
      expect(expiryTime).toBeGreaterThanOrEqual(now + oneHourInMs - 5000);
      expect(expiryTime).toBeLessThanOrEqual(now + oneHourInMs + 5000);
    });
  });

  describe("generateResetPasswordToken", () => {
    it("should generate a new reset token and save it", async () => {
      (getResetPasswordTokenByEmail as jest.Mock).mockResolvedValue(null);
      (prismaMock.passwordResetToken.create as jest.Mock).mockResolvedValue({
        email,
        token: mockToken,
      });

      const result = await generateResetPasswordToken(email);

      expect(uuidMock).toHaveBeenCalled();
      expect(prismaMock.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          email,
          token: mockToken,
          expires: expect.any(Date),
        },
      });
      expect(result.token).toBe(mockToken);
    });

    it("should delete existing reset token if it exists before creating a new one", async () => {
      const existingToken = { id: "old-id", email, token: "old-token" };
      (getResetPasswordTokenByEmail as jest.Mock).mockResolvedValue(existingToken);
      (prismaMock.passwordResetToken.create as jest.Mock).mockResolvedValue({
        email,
        token: mockToken,
      });

      await generateResetPasswordToken(email);

      expect(prismaMock.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { id: "old-id" },
      });
      expect(prismaMock.passwordResetToken.create).toHaveBeenCalled();
    });
  });
});
