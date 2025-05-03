"use client";

import { ProfileContext } from "@/contexts/profile-context";
import { login as libLogin, logout as libLogout } from "@/lib/auth";
import {
  DoctorProfilePayload,
  PatientProfilePayload,
} from "@/types/prisma-payloads";
import { ReactNode, useEffect, useState } from "react";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<
    | null
    | ({
        role: "patient";
      } & PatientProfilePayload)
    | ({
        role: "doctor";
      } & DoctorProfilePayload)
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setProfile(null);
          return;
        }

        setError(`Error fetching profile: ${response.status}, ${response}`);
      } else {
        const profileData = await response.json();
        setProfile(profileData || null);
        setError(null);
      }
    } catch (err) {
      setError(`Error fetching profile: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const login = async (id: string, password: string) => {
    await libLogin(id, password);
    fetchProfile();
  };

  const logout = async () => {
    await libLogout();
    setProfile(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refetch: fetchProfile,
        login,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
