"use client";

import {
  DoctorProfilePayload,
  PatientProfilePayload,
} from "@/types/prisma-payloads";
import { createContext } from "react";

type ProfileContextType = {
  profile:
    | null
    | ({
        role: "patient";
      } & PatientProfilePayload)
    | ({
        role: "doctor";
      } & DoctorProfilePayload);
  loading: boolean;
  error: null | string;
  refetch: () => Promise<void>;
  login: (id: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  error: null,
  refetch: async () => {},
  login: async () => {},
  logout: async () => {},
});
