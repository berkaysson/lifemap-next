import { v4 as uuid } from "uuid";
import prisma from "@/lib/prisma";
import { getResetPasswordTokenByEmail } from "./reset-password-token";
import { getVerificationTokenByEmail } from "./verification-token";

// 1 hour
const TOKEN_EXPIRY = 3600 * 1000;

// db(PrismaClient) is defined in lib/db.ts,

/**
 * Generates a verification token for the given email.
 *
 * @param {string} email - The email for which the verification token is generated.
 * @return {Promise<VerificationToken>} The generated verification token.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + TOKEN_EXPIRY);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

/**
 * Generates a reset password token for the given email.
 *
 * @param {string} email - The email for which the reset password token is generated.
 * @return {Promise<ResetPasswordToken>} The generated reset password token.
 */
export const generateResetPasswordToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + TOKEN_EXPIRY);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const resetPasswordToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetPasswordToken;
};
