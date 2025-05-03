import prisma from "@/prisma";
import { NextResponse } from "next/server";

// GET - Fetch availability for a date range
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const startDate = searchParams.get("start");

  if (!doctorId) {
    return NextResponse.json(
      { error: "Doctor ID is required" },
      { status: 400 }
    );
  }

  try {
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        OR: [
          {
            validUntil: { gte: new Date(startDate || new Date()) },
          },
          { validUntil: null },
        ],
      },
      include: { exceptions: true },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST - Create new availability
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await prisma.doctorAvailability.create({
      data: {
        doctorId: body.doctorId,
        dayOfWeek: body.dayOfWeek,
        startHour: new Date(body.startTime).getHours(),
        startMinute: new Date(body.startTime).getMinutes(),
        endHour: new Date(body.endTime).getHours(),
        endMinute: new Date(body.endTime).getMinutes(),
        isRecurring: body.isRecurring,
        recurrence: body.recurrence,
        validFrom: new Date(body.validFrom),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
      },
      include: { exceptions: true },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    );
  }
}
