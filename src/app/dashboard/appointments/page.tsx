"use client";

import { Calendar, Clock, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { Specialty } from "@/types/prisma-payloads";

export default function AppointmentsPage() {
  const { profile } = useProfile();
  const { appointments } = profile!;
  const pastAppointments = appointments.filter(
    (app) => app.startTime < new Date()
  );
  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.startTime) >= new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex gap-4">
          {profile?.role === "patient" && (
            <Button className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="appointments/new">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="flex w-full flex-row flex-wrap">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 && profile ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          {profile.role === "patient"
                            ? (appointment as { doctor: { name: string } })
                                .doctor.name
                            : (appointment as { patient: { name: string } })
                                .patient.name}
                        </h3>
                        {profile.role === "patient" && (
                          <p className="text-sm text-muted-foreground">
                            {
                              (
                                appointment as {
                                  doctor: { specialty: Specialty };
                                }
                              ).doctor.specialty
                            }
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">
                              {
                                new Date(appointment.startTime)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">
                              {`${String(
                                new Date(appointment.startTime).getHours()
                              ).padStart(2, "0")}:${String(
                                new Date(appointment.startTime).getMinutes()
                              ).padStart(2, "0")}`}
                            </span>
                          </div>
                        </div>
                        {profile?.role === "patient" && (
                          <div className="flex gap-2">
                            <Button variant="destructive" size="sm" asChild>
                              <Link
                                href={`/patient/appointments/${appointment.id}/cancel`}
                              >
                                Cancel
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                You have no upcoming appointments
              </p>
              {profile?.role === "patient" && (
                <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="appointments/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Book an Appointment
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {profile && pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          {profile.role === "patient"
                            ? (appointment as { doctor: { name: string } })
                                .doctor.name
                            : (appointment as { patient: { name: string } })
                                .patient.name}
                        </h3>
                        {profile.role === "patient" && (
                          <p className="text-sm text-muted-foreground">
                            {
                              (
                                appointment as {
                                  doctor: { specialty: Specialty };
                                }
                              ).doctor.specialty
                            }
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">
                              {
                                new Date(appointment.startTime)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">
                              {`${String(
                                new Date(appointment.startTime).getHours()
                              ).padStart(2, "0")}:${String(
                                new Date(appointment.startTime).getMinutes()
                              ).padStart(2, "0")}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/patient/appointments/${appointment.id}`}
                            >
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/patient/appointments/new?rebook=${appointment.id}`}
                            >
                              Rebook
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                You have no past appointments
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
