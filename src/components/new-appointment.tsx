"use client";

import type React from "react";

import { Calendar, Clock, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DoctorProfilePayload } from "@/types/prisma-payloads";

export default function NewAppointmentModal({
  isOpen: open,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctors, setDoctors] = useState<DoctorProfilePayload[]>([]);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorProfilePayload | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch("/api/doctors");
      const fetchedDoctors = await response.json();
      setDoctors(fetchedDoctors);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Mock data for available time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`absolute ${
        !open && "hidden"
      }  top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)]`}
    >
      <div
        className={`relative top-1/2 left-1/2 -translate-1/2 flex flex-col gap-4 w-11/12 max-h-11/12 overflow-y-auto bg-white shadow-accent rounded-2xl p-4`}
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">New Appointment</h1>
          <Button
            variant="ghost"
            size="icon"
            className="p-4 rounded-md cursor-pointer"
            onClick={() => {
              close();
            }}
          >
            <X className="min-h-4 min-w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Select a doctor and specify your appointment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select required>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id.toString()}
                          className={`${
                            doctor === selectedDoctor && "bg-accent"
                          }`}
                          onClick={() => {
                            if (doctor !== selectedDoctor) {
                              setSelectedDoctor(doctor);
                            }
                          }}
                        >
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-type">Appointment Type</Label>
                  <RadioGroup defaultValue="consultation" id="appointment-type">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="consultation" id="consultation" />
                      <Label htmlFor="consultation">Consultation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="follow-up" id="follow-up" />
                      <Label htmlFor="follow-up">Follow-up</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="procedure" id="procedure" />
                      <Label htmlFor="procedure">Procedure</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe your symptoms or reason for the appointment"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>
                  Select a date and time for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates and weekends
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const day = date.getDay();
                          return date < now || day === 0 || day === 6;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/patient/appointments">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={!!!selectedDoctor}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
