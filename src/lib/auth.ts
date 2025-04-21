"use server";
import { signIn } from "@/auth";

export const patientLogin = async (id: string, password: string) => {
  await signIn("credentials", {
    id,
    password,
    userType: "patient",
    redirectTo: "/dashboard",
  });
};

export const doctorLogin = async (id: string, password: string) => {
  await signIn("credentials", {
    id,
    password,
    userType: "doctor",
    redirectTo: "/dashboard",
  });
};
