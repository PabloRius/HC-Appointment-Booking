"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppointmentDateSelector } from "@/components/appointment-date-selector";
import {
  AppointmentDoctorSelector,
  DoctorAvailability,
} from "@/components/appointment-doctor-selector";
import AppointmentSummary from "@/components/appointment-summary";
import { AppointmentTypeSelector } from "@/components/appointment-type-selector";
import { AppointmentSteps } from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useState } from "react";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);

  const [availableDates, setAvailableDoctors] = useState<
    { date: Date; doctors: DoctorAvailability[] }[]
  >([]);

  const [doctor, setDoctor] = useState<{
    id: string | null;
    name: string | null;
    specialty: string | null;
  }>({ id: null, name: null, specialty: null });
  const [timeSlot, setTimeslot] = useState<{
    startTime: Date | null;
    endTime: Date | null;
  }>({ startTime: null, endTime: null });

  const fetchAvailable = useCallback(async () => {
    try {
      if (appointmentType && date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const response = await fetch(
          `/api/timeslots?type=${appointmentType}&date=${dateStr}${
            time ? `&time=${time}` : ""
          }`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        setAvailableDoctors(data);
        setCurrentStep(3);
      }
    } catch (err) {
      console.error(err);
      // Handle error (show toast, etc.)
    }
  }, [appointmentType, date, time]);

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          onClick={() => router.back()}
        >
          <div>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </div>
        </Button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Appointment</CardTitle>
          <CardDescription>
            Follow the steps below to book your appointment with one of our
            healthcare professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentSteps currentStep={currentStep} />
          <div className="mt-4">
            {currentStep === 1 ? (
              <AppointmentTypeSelector
                appointmentType={appointmentType}
                setAppointmentType={setAppointmentType}
                nextStep={() => {
                  setCurrentStep(2);
                }}
              />
            ) : currentStep === 2 && appointmentType ? (
              <AppointmentDateSelector
                appointmentDate={date}
                setAppointmentDate={setDate}
                appointmentTime={time}
                setAppointmentTime={setTime}
                nextStep={() => {
                  fetchAvailable();
                  setCurrentStep(3);
                }}
              />
            ) : currentStep === 3 && appointmentType && date ? (
              <AppointmentDoctorSelector
                availableDates={availableDates}
                doctorId={doctor.id}
                setDoctor={setDoctor}
                startTime={timeSlot.startTime}
                endTime={timeSlot.endTime}
                setStartTime={(startTime: Date | null) => {
                  setTimeslot((prev) => ({ ...prev, startTime: startTime }));
                }}
                setEndTime={(endTime: Date | null) => {
                  setTimeslot((prev) => ({ ...prev, endTime: endTime }));
                }}
                nextStep={() => {
                  setCurrentStep(4);
                }}
              />
            ) : currentStep === 4 &&
              doctor.id &&
              doctor.name &&
              doctor.specialty &&
              timeSlot.startTime &&
              timeSlot.endTime ? (
              <AppointmentSummary
                doctor={
                  doctor as { id: string; name: string; specialty: string }
                }
                startTime={timeSlot.startTime}
                endTime={timeSlot.endTime}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
