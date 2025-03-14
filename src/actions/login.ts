"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/helpers/user";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schema";
import { archiveOutdatedEntities } from "@/services/archivingService";
import { generateVerificationToken } from "@/helpers/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  // Validate the login data
  const validatedFields = LoginSchema.safeParse(data);

  // If the validation fails, return an error message
  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  // Destructure the validated fields
  const { email, password } = validatedFields.data;

  // Check if the user exists and has a password
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { message: "Invalid credentials!", success: false };
  }

  // Compare the provided password with the stored password
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return { message: "Invalid credentials!", success: false };
  }
  // If the user hasn't verified their email, send a verification email and return a message
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { message: "Confirmation email sent!", success: true };
  }

  try {
    // Attempt to sign in the user
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Archive outdated entities
    await archiveOutdatedEntities();

    return { message: "Login successful!", success: true };
  } catch (error) {
    // If there's an authentication error, handle it
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials!", success: false };
        default:
          return { message: "Authentication error", success: false };
      }
    }

    // If there's any other error, rethrow it
    throw error;
  }
};
