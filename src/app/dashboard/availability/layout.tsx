"use client";

import { useProfile } from "@/hooks/useProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function AvailabilityLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, loading } = useProfile();
  if (!profile && !loading) redirect("/dashboard");
  if (profile && !(profile.role === "doctor")) redirect("/dashboard");
  return children;
}
