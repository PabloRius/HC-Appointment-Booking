import prisma from "@/prisma";
import { NextResponse } from "next/server";

// PUT - Update availability
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = params.id;

    const startHour = new Date(body.startTime).getHours();
    const startMinute = new Date(body.startTime).getMinutes();
    const endHour = new Date(body.endTime).getHours();
    const endMinute = new Date(body.endTime).getMinutes();

    const updated = await prisma.doctorAvailability.update({
      where: { id },
      data: {
        dayOfWeek: body.dayOfWeek,
        startHour,
        startMinute,
        endHour,
        endMinute,
        isRecurring: body.isRecurring,
        recurrence: body.isRecurring ? body.recurrence : null,
        validFrom: new Date(body.validFrom),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
      },
      include: { exceptions: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}
