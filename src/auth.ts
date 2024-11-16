import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./helpers/user";
import authConfig from "./auth.config";
import { UserRole } from "@prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      // activate verification later
      // if (!existingUser || existingUser.emailVerified === null) {
      //   return false;
      // }
      
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        // add more fields to the session object if needed
        // to add additional fields also update the next-auth.d.ts file like UserRole
        // for more info check next-auth.d.ts
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
      }
      return token;
    },
  },
  events: {
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
