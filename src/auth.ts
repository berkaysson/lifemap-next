import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./helpers/user";
import authConfig from "./auth.config";
import { UserRole } from "@prisma/client";
import { seedDefaultStarter } from "@/actions/seed-default-starter";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser || existingUser.emailVerified === null) {
        return false;
      }
      
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        // also expose emailVerified to the client session
        // @ts-expect-error augmented in next-auth.d.ts
        session.user.emailVerified = (token as any).emailVerified ?? null;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
        (token as any).emailVerified = existingUser.emailVerified
          ? existingUser.emailVerified.toISOString()
          : null;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user?.id) return;
      try {
        await seedDefaultStarter(user.id);
      } catch (error) {
        // intentionally ignore seeding errors to not block auth flow
      }
    },
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
