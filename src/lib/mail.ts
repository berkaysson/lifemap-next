import { MAIN_DOMAIN } from "@/routes";
import { Resend } from "resend";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Send verification email
export const sendVerificationEmail = async (
  email: string | null | undefined,
  token: string | null | undefined
) => {
  if (!email || !token) {
    throw new Error("Email or token is null or undefined");
  }

  try {
    const confirmLink = `${MAIN_DOMAIN}/auth/new-verification?token=${token}`;

    await resend.emails.send({
      from: "noreply@habivita.com",
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href='${confirmLink}'>here</a> to confirm email.</p>`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (
  email: string | null | undefined,
  token: string | null | undefined
) => {
  if (!email || !token) {
    throw new Error("Email or token is null or undefined");
  }

  const resetLink = `${MAIN_DOMAIN}/auth/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "noreply@habivita.com",
      to: email,
      subject: "Reset your email",
      html: `<p>Click <a href='${resetLink}'>here</a> to reset password.</p>`,
    });
  } catch (error) {
    console.error("Failed to sending reset password email:", error);
    throw new Error(`Error sending reset password email`);
  }
};
