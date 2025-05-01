"use client";

import { ProfileContext } from "@/contexts/profile-context";
import { useContext } from "react";

export const useProfile = () => useContext(ProfileContext);
