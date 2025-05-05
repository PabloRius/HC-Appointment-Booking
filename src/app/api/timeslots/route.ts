import { DoctorAvailability } from "@/components/appointment-doctor-selector";
import prisma from "@/prisma";
import { isSameDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const dateParam = searchParams.get("date");

  if (!type || !dateParam) {
    return NextResponse.json(
      { error: "Type and date are required parameters" },
      { status: 400 }
    );
  }

  try {
    const [year, month, day] = dateParam.split("-").map(Number);
    const fromDate = new Date(Date.UTC(year, month - 1, day));

    const maxLookahead = 15;
    const daysWithSlots: { date: Date; doctors: DoctorAvailability[] }[] = [];

    for (
      let offset = 0;
      offset < maxLookahead && daysWithSlots.length < 3;
      offset++
    ) {
      const currentDate = new Date(fromDate);
      currentDate.setUTCDate(fromDate.getUTCDate() + offset);

      const doctors = await prisma.doctorProfile.findMany({
        where: { specialty: type },
        include: {
          availability: { include: { exceptions: true } },
          appointments: true,
        },
      });

      const dayResults = await Promise.all(
        doctors.map(async (doctor) => {
          const slots: { id: string; startTime: string; endTime: string }[] =
            doctor.availability
              .map((slot) => {
                if (
                  !slot.isRecurring &&
                  isSameDay(slot.validFrom, currentDate)
                ) {
                  const slotStart = currentDate;
                  slotStart.setUTCHours(slot.startHour, slot.startMinute, 0, 0);

                  const isBooked = doctor.appointments.some((booked) => {
                    console.log(
                      booked.startTime,
                      slotStart,
                      slotStart === booked.startTime
                    );
                    return slotStart === booked.startTime;
                  });
                  if (!isBooked) {
                    console.log(`${slotStart} - Isn't booked, adding`);
                    return {
                      id: slot.id,
                      startTime: `${String(slot.startHour).padStart(
                        2,
                        "0"
                      )}:${String(slot.startMinute).padStart(2, "0")}`,
                      endTime: `${String(slot.endHour).padStart(
                        2,
                        "0"
                      )}:${String(slot.endMinute).padStart(2, "0")}`,
                    };
                  }
                }
                return null;
              })
              .filter(
                (slot): slot is NonNullable<typeof slot> => slot !== null
              );

          return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            availableSlots: slots,
          };
        })
      );

      const availableDoctors = dayResults.filter(
        (doctor) => doctor.availableSlots.length > 0
      );

      if (availableDoctors.length > 0) {
        daysWithSlots.push({
          date: currentDate,
          doctors: availableDoctors,
        });
      }
    }

    return NextResponse.json(daysWithSlots);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability data" },
      { status: 500 }
    );
  }
}
