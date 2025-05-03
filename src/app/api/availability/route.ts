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
    const isRecurring = body.isRecurring;
    const doctorId = body.doctorId;
    const validFrom = new Date(body.validFrom);
    const startHour = new Date(body.startTime).getHours();
    const startMinute = new Date(body.startTime).getMinutes();
    const endHour = new Date(body.endTime).getHours();
    const endMinute = new Date(body.endTime).getMinutes();

    if (!isRecurring) {
      const conflictingSlots = await prisma.doctorAvailability.findMany({
        where: {
          doctorId,
          validFrom,
          isRecurring,
          OR: [
            {
              AND: [
                {
                  OR: [
                    {
                      startHour: { lt: startHour },
                    },
                    {
                      startHour: { equals: startHour },
                      startMinute: { lte: startMinute },
                    },
                  ],
                },
                {
                  OR: [
                    {
                      endHour: { gt: startHour },
                    },
                    {
                      endHour: { equals: startHour },
                      endMinute: { gt: startMinute },
                    },
                  ],
                },
              ],
            },
            {
              AND: [
                {
                  OR: [
                    {
                      startHour: { lt: endHour },
                    },
                    {
                      startHour: { equals: endHour },
                      startMinute: { lt: endMinute },
                    },
                  ],
                },
                {
                  OR: [
                    {
                      endHour: { gt: endHour },
                    },
                    {
                      endHour: { equals: endHour },
                      endMinute: { gte: endMinute },
                    },
                  ],
                },
              ],
            },
            { startHour, startMinute },
          ],
        },
      });

      if (conflictingSlots.length > 0) {
        return NextResponse.json(
          { error: "Record with similar timeslots already exists." },
          { status: 400 }
        );
      }
    }

    const result = await prisma.doctorAvailability.create({
      data: {
        doctorId,
        dayOfWeek: body.dayOfWeek,
        startHour,
        startMinute,
        endHour: new Date(body.endTime).getHours(),
        endMinute: new Date(body.endTime).getMinutes(),
        isRecurring,
        recurrence: body.recurrence,
        validFrom,
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

// PUT - Update availability
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;

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
