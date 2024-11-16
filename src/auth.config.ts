import credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import { LoginSchema } from "./schema";
import { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./helpers/user";

export default {
  providers: [
    // github({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
