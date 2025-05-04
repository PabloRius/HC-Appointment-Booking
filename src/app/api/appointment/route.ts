import prisma from "@/prisma";
import { appointmentSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includePast = searchParams.get("includePast") === "true";
    const now = new Date();
    console.log(now);

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: includePast ? undefined : { gte: now },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialty: true,
          },
        },
        patient: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: data.doctorId },
    });

    const patient = await prisma.patientProfile.findUnique({
      where: { id: data.patientId },
    });

    if (!doctor || !patient) {
      return NextResponse.json(
        { error: "Doctor or Patient not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        status: "confirmed",
        notes: data.notes,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        doctorId: data.doctorId,
        patientId: data.patientId,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
