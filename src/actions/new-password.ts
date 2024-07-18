"use server";

import { getResetPasswordTokenByToken } from "@/data/reset-password-token";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { NewPasswordSchema } from "@/schema";
import { z } from "zod";
const bcrypt = require("bcryptjs");

export const newPassword = async (
  data: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // Check if the token is valid
  if (!token) {
    return { message: "Invalid token", success: false };
  }

  // Validate the new password data
  const validatedFields = NewPasswordSchema.safeParse(data);

  // If the validation fails, return an error message
  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  // Retrieve the password reset token
  const existingToken = await getResetPasswordTokenByToken(token);

  // If the token does not exist, return an error message
  if (!existingToken) {
    return { message: "Token does not exist!", success: false };
  }

  // Check if the token has expired
  if (new Date() > new Date(existingToken.expires)) {
    return { message: "Token has expired!", success: false };
  }

  // Retrieve the user associated with the token
  const existingUser = await getUserByEmail(existingToken.email);

  // If the user does not exist, return an error message
  if (!existingUser) {
    return { message: "User does not exist!", success: false };
  }

  // Hash the new password
  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Delete the password reset token
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  // Return a success message
  return { message: "Password changed successfully", success: true };
};
