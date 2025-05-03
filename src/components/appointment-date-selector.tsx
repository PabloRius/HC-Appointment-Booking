"use client";

import { format } from "date-fns";
import { ArrowRight, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AppointmentDateSelector({
  appointmentDate,
  setAppointmentDate,
  appointmentTime,
  setAppointmentTime,
  nextStep,
}: {
  appointmentDate: Date | undefined;
  setAppointmentDate: (appointmentDate: Date | undefined) => void;
  appointmentTime: string | undefined;
  setAppointmentTime: (appointmentTime: string) => void;
  nextStep: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Select Your Preferred Date
        </h2>
        <p className="text-muted-foreground mb-6">
          Choose a date for your appointment. You can also specify a preferred
          time of day.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-16"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {appointmentDate
                  ? format(appointmentDate, "PPP")
                  : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={appointmentDate}
                onSelect={setAppointmentDate}
                initialFocus
                disabled={(date) => {
                  // Disable past dates and weekends
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  return date < now;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <Label>Preferred Time (Optional)</Label>
          <div className="border rounded-md p-4 bg-white h-16">
            <input
              aria-label="Time"
              type="time"
              step={30}
              value={appointmentTime}
              onChange={(e) => {
                setAppointmentTime(e.target.value);
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This is a preference only. Available time slots will be shown in the
            next step.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!appointmentDate}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Find Available Doctors
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
