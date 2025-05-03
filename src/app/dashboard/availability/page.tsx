"use client";

import { DoctorAvailabilityCalendar } from "@/components/doctor-availability-calendar";
import { useProfile } from "@/hooks/useProfile";

export default function AvailabilityPage() {
  const { profile } = useProfile();
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <DoctorAvailabilityCalendar doctorId={profile!.id} />
    </div>
  );
}
