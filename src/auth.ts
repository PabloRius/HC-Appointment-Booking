import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        id: { label: "National ID", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { type: "hidden" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { id, password, userType } = validatedFields.data;

        if (userType === "patient") {
          console.log("Logging a patient");
          const user = await prisma.patient.findUnique({
            where: { nationalId: id },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return {
            id: user.id,
            nationalId: user.nationalId,
            email: user.email,
            name: user.name,
            role: "patient",
          };
        } else if (userType === "doctor") {
          const doctor = await prisma.doctor.findUnique({
            where: { Id: id },
          });

          if (!doctor || !doctor.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password as string,
            doctor.password
          );

          if (!passwordsMatch) return null;

          return {
            id: doctor.id,
            doctorId: doctor.Id,
            email: doctor.email,
            name: doctor.name,
            role: "doctor",
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
});
