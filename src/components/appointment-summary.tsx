"use client";

import { format } from "date-fns";
import { Calendar, Check, Clock, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AppointmentSummary({
  doctor,
  startTime,
  endTime,
}: {
  doctor: { id: string; name: string; specialty: string };
  startTime: Date;
  endTime: Date;
}) {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    // In a real app, this would create the appointment in the database
    // For demo purposes, we'll just redirect to the appointments page
  };

  if (!doctor || !startTime || !endTime) {
    return null;
  }

  return (
    <>
      <div className="mt-8 space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Appointment Type</p>
              <p className="font-medium">{doctor.specialty}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Doctor</p>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 mr-2">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-teal-600 mr-2" />
                <p>{format(startTime, "PPPP")}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Time</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-teal-600 mr-2" />
                <p>{`${String(startTime.getHours()).padStart(2, "0")}:${String(
                  startTime.getMinutes()
                ).padStart(2, "0")}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Please provide any additional information that might be helpful for your appointment"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100">
              <Check className="h-3 w-3 text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-teal-800">
                Important Information
              </h3>
              <ul className="mt-2 text-sm text-teal-700 space-y-1">
                <li>
                  Please arrive 15 minutes before your scheduled appointment
                  time.
                </li>
                <li>Bring your insurance card and photo ID.</li>
                <li>
                  If you need to cancel, please do so at least 24 hours in
                  advance.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handleConfirm}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Confirm Appointment
        </Button>
      </div>
    </>
  );
}
