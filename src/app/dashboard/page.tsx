"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import {
  DoctorProfilePayload,
  PatientProfilePayload,
} from "@/types/prisma-payloads";
import { TabsContent } from "@radix-ui/react-tabs";
import { endOfDay } from "date-fns";
import { Calendar, Clock, Loader2, Plus, User } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { profile, loading } = useProfile();
  return !profile && loading ? (
    <Loader2 className="animate-spin" />
  ) : !profile ? null : profile.role === "doctor" ? (
    <DoctorDashboard profile={profile} />
  ) : profile.role === "patient" ? (
    <PatientDashboard profile={profile} />
  ) : null;
}

function PatientDashboard({ profile }: { profile: PatientProfilePayload }) {
  const { appointments } = profile;
  const { refetch } = useProfile();

  const date = appointments[0]
    ? new Date(appointments[0].startTime)
    : undefined;
  const fullDate = date ? date.toISOString().split("T")[0] : undefined;
  const fullTime = date
    ? `${String(date?.getHours()).padStart(2, "0")}:${String(
        date?.getMinutes()
      ).padStart(2, "0")}`
    : "";

  const handleCancel = async (id: string) => {
    try {
      window.confirm(
        "Please confirm the following action before proceeding: CANCEL THE APPOINTMENT"
      );
      await fetch(`/api/appointment?id=${id}`, { method: "DELETE" });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <Button className="bg-teal-600 hover:bg-teal-700" asChild>
          <Link href="dashboard/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {appointments && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Next Appointment</CardTitle>
              <CardDescription>Your next scheduled visit</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-lg font-medium">
                    {appointments[0].doctor.name}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {appointments[0].doctor.specialty}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                    {fullDate}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-teal-600" />
                    {fullTime}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </CardContent>
            <CardFooter>
              {appointments.length > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/patient/appointments/${appointments[0].id}`}>
                    View Details
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="dashboard/appointments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        {appointments?.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const date = new Date(new Date(appointment.startTime));
              const fullDate = date.toISOString().split("T")[0];
              const fullTime = `${String(date.getHours()).padStart(
                2,
                "0"
              )}:${String(date.getMinutes()).padStart(2, "0")}`;

              return (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          {appointment.doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {appointment.doctor.specialty}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">{fullDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-sm">{fullTime}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              handleCancel(appointment.id);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                You have no upcoming appointments
              </p>
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700" asChild>
                <Link href="dashboard/appointments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Book an Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DoctorDashboard({ profile }: { profile: DoctorProfilePayload }) {
  const appointments = profile.appointments || [];
  const todayAppointments =
    appointments?.filter(
      (appointment) => new Date(appointment.startTime) <= endOfDay(new Date())
    ) || [];
  console.log(appointments);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{"Today's Appointments"}</CardTitle>
            <CardDescription>
              You have {todayAppointments.length} appointments today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>Your next scheduled appointment</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-2">
                <div className="text-lg font-medium">
                  {appointments[0].patient?.name}
                </div>
                <div className="flex flex-col text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                    <span className="text-sm">
                      {
                        new Date(appointments[0].startTime)
                          .toISOString()
                          .split("T")[0]
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-600" />
                    {`${String(
                      new Date(appointments[0].startTime).getHours()
                    ).padStart(2, "0")}:${String(
                      new Date(appointments[0].startTime).getMinutes()
                    ).padStart(2, "0")}`}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No upcoming appointments
              </div>
            )}
          </CardContent>
          <CardFooter>
            {todayAppointments.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/doctor/appointments/${todayAppointments[0].id}`}>
                  View Details
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="flex flex-row flex-wrap w-full h-auto">
          <TabsTrigger value="today">{"Today's Schedule"}</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{"Today's Appointments"}</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {appointment.patient?.name}
                          </h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(appointment.startTime).getTime()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/doctor/appointments/${appointment.id}`}>
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                          asChild
                        >
                          <Link
                            href={`/doctor/appointments/${appointment.id}/start`}
                          >
                            Start
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        You have no appointments today
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your schedule for the next few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments?.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const date = new Date(new Date(appointment.startTime));
                    const fullDate = date.toISOString().split("T")[0];
                    const fullTime = `${String(date.getHours()).padStart(
                      2,
                      "0"
                    )}:${String(date.getMinutes()).padStart(2, "0")}`;

                    return (
                      <Card key={appointment.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {appointment.patient.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                                  <span className="text-sm">{fullDate}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-teal-600" />
                                  <span className="text-sm">{fullTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      You have no upcoming appointments
                    </p>
                    <Button
                      className="mt-4 bg-teal-600 hover:bg-teal-700"
                      asChild
                    >
                      <Link href="dashboard/appointments/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Book an Appointment
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
