import prisma from "@/lib/prisma";

// db(PrismaClient) is defined in lib/db.ts,

/**
 * Retrieves a reset password token by its token value.
 *
 * @param {string} token - The token value to search for.
 * @return {Promise<ResetPasswordToken | null>} A Promise that resolves to the reset password token if found, or null if not found.
 */
export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    return resetPasswordToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Retrieves the first reset password token associated with the given email.
 *
 * @param {string} email - The email to search for.
 * @return {Promise<ResetPasswordToken | null>} A Promise that resolves to the reset password token if found, or null if not found.
 */
export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return resetPasswordToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
