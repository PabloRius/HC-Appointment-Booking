import prisma from "@/prisma";
import { appointmentSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

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
