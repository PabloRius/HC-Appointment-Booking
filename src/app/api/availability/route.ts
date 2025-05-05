import prisma from "@/prisma";
import { NextResponse } from "next/server";

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

  if (!startDate) {
    return NextResponse.json(
      { error: "Start date is required" },
      { status: 400 }
    );
  }
  console.log(doctorId, startDate);

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
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch availability` },
      { status: 500 }
    );
  }
}

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
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    );
  }
}

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
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const availabilityId = searchParams.get("id");

    if (!availabilityId) {
      return NextResponse.json(
        { error: "Availability ID is required" },
        { status: 400 }
      );
    }

    const existingAvailability = await prisma.doctorAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: "Availability not found" },
        { status: 404 }
      );
    }

    await prisma.doctorAvailability.delete({
      where: { id: availabilityId },
    });

    return NextResponse.json(
      { message: "Availability deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
