"use server";

import { generateResetPasswordToken } from "@/helpers/tokens";
import { getUserByEmail } from "@/helpers/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { ResetSchema } from "@/schema";
import * as z from "zod";

export const reset = async (data: z.infer<typeof ResetSchema>) => {
  // Validate the reset data
  const validatedFields = ResetSchema.safeParse(data);

  // If the validation fails, return an error message
  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  // Destructure the validated fields
  const { email } = validatedFields.data;

  // Check if the user exists
  const user = await getUserByEmail(email);
  if (!user) {
    return { message: "Email Sent", success: true };
  }

  // Generate a reset password token
  const resetPasswordToken = await generateResetPasswordToken(email);

  // Send a reset password email
  await sendResetPasswordEmail(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  // Return a success message
  return { message: "Email Sent", success: true };
};
