"use server";

import { getUserByEmail } from "@/helpers/user";
import { getVerificationTokenByToken } from "@/helpers/verification-token";
import prisma from "@/lib/prisma";

export const newVerification = async (token: string) => {
  // Retrieve the token from the database
  const existingToken = await getVerificationTokenByToken(token);

  // If the token does not exist, return an error message
  if (!existingToken) {
    return { message: "Token does not exist!", success: false };
  }

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { message: "Token has expired!", success: false };
  }

  // Retrieve the user associated with the token
  const existingUser = await getUserByEmail(existingToken.email);

  // If the user does not exist, return an error message
  if (!existingUser) {
    return { message: "Email does not exist!", success: false };
  }

  // Update the user's email and emailVerified fields
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // Delete the verification token
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Return a success message
  return { message: "Email verified!", success: true };
};
