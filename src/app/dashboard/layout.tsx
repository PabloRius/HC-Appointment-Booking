"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session || !session?.user) {
    console.error("Not signed in, redirecting to Log in page");
    redirect("/auth/login");
  }
  return children;
}
