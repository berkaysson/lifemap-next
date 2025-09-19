import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

/**
 * Extends the default NextAuth session user with a role property.
 *
 * - `ExtendedUser`: Extends the default session user to include `role` of type `UserRole`.
 * - `Session`: Extends the NextAuth session interface to include `ExtendedUser`.
 */

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  // ISO string or null; we only need it for client-side limits
  emailVerified?: string | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
