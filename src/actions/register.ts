"use server";

import { generateVerificationToken } from "@/helpers/tokens";
import { getUserByEmail } from "@/helpers/user";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { z } from "zod";
import { RegisterSchema } from "@/schema";
const bcrypt = require("bcryptjs");

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  // Validate the registration data
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    // If the data is invalid, return an error message
    return { message: "Invalid fields!", success: false };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the email is already in use
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { message: "Email already in use!", success: false };
  }

  // Create a new user with the provided data
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // Generate a verification token for the new user
  const verificationToken = await generateVerificationToken(email);

  // Send a verification email to the user
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  // Return a success message
  return { message: "Email Sent", success: true };
};
