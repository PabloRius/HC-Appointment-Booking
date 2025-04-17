import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        nationalId: { label: "National ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { nationalId, password } = validatedFields.data;

        const user = await prisma.user.findUnique({ where: { nationalId } });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, user }) {
      const userData = await prisma.user.findUnique({ where: { id: user.id } });
      if (!userData) return session;

      const customUserInfo = {
        ...session.user,
        nationalId: userData.nationalId,
      };
      return { ...session, user: customUserInfo };
    },
  },
  pages: {
    signIn: "/",
  },
});
