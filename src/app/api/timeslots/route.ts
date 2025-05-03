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
    const fromDate = new Date(dateParam);
    const maxLookahead = 15;
    const daysWithSlots: { date: Date; doctors: DoctorAvailability[] }[] = [];

    for (
      let offset = 0;
      offset < maxLookahead && daysWithSlots.length < 3;
      offset++
    ) {
      const currentDate = new Date(fromDate);
      currentDate.setDate(fromDate.getDate() + offset);

      const doctors = await prisma.doctorProfile.findMany({
        where: { specialty: type },
        include: { availability: { include: { exceptions: true } } },
      });

      const dayResults = await Promise.all(
        doctors.map(async (doctor) => {
          const slots: { id: string; startTime: string; endTime: string }[] =
            doctor.availability
              .map((slot) => {
                if (!slot.isRecurring) {
                  if (isSameDay(slot.validFrom, currentDate)) {
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
              })
              .filter((slot) => !!slot);

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
