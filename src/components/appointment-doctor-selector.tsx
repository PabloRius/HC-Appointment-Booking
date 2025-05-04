"use client";

import { format } from "date-fns";
import { ArrowRight, Clock, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface DoctorAvailability {
  id: string;
  name: string;
  specialty: string;
  availableSlots: {
    id: string;
    startTime: string; // ISO string format
    endTime: string; // ISO string format
  }[];
}

export function AppointmentDoctorSelector({
  availableDates,
  doctorId,
  setDoctor,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  nextStep,
}: {
  availableDates: { date: Date; doctors: DoctorAvailability[] }[];
  doctorId: string | null;
  setDoctor: ({
    id,
    name,
    specialty,
  }: {
    id: string;
    name: string;
    specialty: string;
  }) => void;
  startTime: Date | null;
  endTime: Date | null;
  setStartTime: (startTime: Date | null) => void;
  setEndTime: (endTime: Date | null) => void;
  nextStep: () => void;
}) {
  const [selectedTabDate, setSelectedTabDate] = useState<string>("");

  // Check if there are any doctors available for the selected type
  if (availableDates.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No Doctors Available</h3>
        <p className="text-muted-foreground mb-6">
          {
            "We couldn't find any doctors available for your selection. Please try a different specialty or date."
          }
        </p>
        <Button onClick={() => {}} className="bg-teal-600 hover:bg-teal-700">
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
        <p className="text-muted-foreground mb-6">
          Select a doctor and an available time slot for your appointment
        </p>
      </div>

      <Tabs
        value={selectedTabDate}
        onValueChange={setSelectedTabDate}
        className="w-full"
      >
        <TabsList className="flex flex-row flex-wrap w-full">
          {availableDates.map(({ date }) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const displayDate = format(date, "EEE, MMM d");
            return (
              <TabsTrigger key={dateStr} value={dateStr}>
                {displayDate}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {availableDates.map(({ date, doctors }) => {
          const dateStr = format(date, "yyyy-MM-dd");

          return (
            <TabsContent key={dateStr} value={dateStr} className="mt-6">
              {doctors ? (
                <div className="space-y-6">
                  {doctors.map((doctor) => {
                    if (doctor.availableSlots.length === 0) return null;

                    return (
                      <Card key={doctor.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6 border-b">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                                  <User className="h-6 w-6 text-teal-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{doctor.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {doctor.specialty}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-gray-50">
                            <h4 className="text-sm font-medium mb-3">
                              Available Time Slots
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {doctor.availableSlots.map((slot) => {
                                const startTimeString = `${String(
                                  startTime?.getHours()
                                ).padStart(2, "0")}:${String(
                                  startTime?.getMinutes()
                                ).padStart(2, "0")}`;
                                const endTimeString = `${String(
                                  endTime?.getHours()
                                ).padStart(2, "0")}:${String(
                                  endTime?.getMinutes()
                                ).padStart(2, "0")}`;
                                const isSelected =
                                  doctorId === doctor.id &&
                                  startTimeString === slot.startTime &&
                                  endTimeString === slot.endTime;
                                return (
                                  <Button
                                    key={slot.id}
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center justify-center w-fit ${
                                      isSelected
                                        ? "border-teal-600 bg-teal-50 text-teal-600"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (!isSelected) {
                                        setDoctor({ ...doctor });
                                        const formattedStartDate = new Date(
                                          selectedTabDate
                                        );
                                        const formattedEndDate = new Date(
                                          selectedTabDate
                                        );
                                        formattedStartDate.setHours(
                                          parseInt(
                                            slot.startTime.split(":")[0]
                                          ),
                                          parseInt(slot.startTime.split(":")[1])
                                        );
                                        formattedEndDate.setHours(
                                          parseInt(slot.endTime.split(":")[0]),
                                          parseInt(slot.endTime.split(":")[1])
                                        );
                                        setStartTime(formattedStartDate);
                                        setEndTime(formattedEndDate);
                                      }
                                    }}
                                  >
                                    <Clock className="mr-1 h-3 w-3" />
                                    {slot.startTime} - {slot.endTime}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No Availability</h3>
                  <p className="text-muted-foreground">
                    There are no available appointments on this date. Please
                    select another date.
                  </p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!doctorId || !startTime || !endTime}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Continue to Confirmation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
