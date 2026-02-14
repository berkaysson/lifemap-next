import { MAIN_DOMAIN } from "@/routes";
import { Resend } from "resend";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Send verification email
export const sendVerificationEmail = async (
  email: string | null | undefined,
  token: string | null | undefined,
) => {
  if (!email || !token) {
    throw new Error("Email or token is null or undefined");
  }

  try {
    const confirmLink = `${MAIN_DOMAIN}/auth/new-verification?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Email Verification</h1>
        <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
        <a href="${confirmLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "noreply@habivita.com",
      to: email,
      subject: "Confirm your email",
      html: html,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (
  email: string | null | undefined,
  token: string | null | undefined,
) => {
  if (!email || !token) {
    throw new Error("Email or token is null or undefined");
  }

  const resetLink = `${MAIN_DOMAIN}/auth/new-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Password Reset</h1>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <a href="${resetLink}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
        If you didn't request this, please ignore this email. The link will expire.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "noreply@habivita.com",
      to: email,
      subject: "Reset your password",
      html: html,
    });
  } catch (error) {
    console.error("Failed to sending reset password email:", error);
    throw new Error(`Error sending reset password email`);
  }
};
