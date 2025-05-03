"use client";

import { useProfile } from "@/hooks/useProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function AppointmentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, loading } = useProfile();
  if (!profile && !loading) redirect("/dashboard");
  if (profile && !(profile.role === "patient")) redirect("/dashboard");
  return children;
}
